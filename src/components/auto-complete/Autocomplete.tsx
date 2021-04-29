import { useCallback, useEffect, useRef } from "react";
// Do not import directly from @popperjs/core, read the docs
import { createPopper } from "@popperjs/core/lib/createPopper";
import type { Instance, Modifier } from "@popperjs/core";
import maxSize from "popper-max-size-modifier";
import Fuse from "fuse.js";
import { useImmer } from "use-immer";
import { useSpring, animated } from "react-spring";

import useWardStore, {
  getUpdateState,
  getWardList,
} from "@src/stores/ward.store";
import { Search, SearchProps, Badge } from "@src/components";
import { WardDataJSON } from "../noop";
import css from "./Autocomplete.module.css";
import { cx, KEY_CODES } from "@src/utils";

//#region Autocomplete List Item
type Item = WardDataJSON & { active?: boolean };

export interface AutocompleteListItem extends CommonReactProps {
  value: Item;
  animate?: boolean;
  onClick?: (item: Item) => void;
}

export const AutocompleteListItem: React.FC<AutocompleteListItem> = props => {
  const rootRef = useRef<HTMLLIElement>(null);
  const styles = useSpring({
    from: {
      opacity: 0.2,
    },
    to: {
      opacity: 1,
    },
    delay: 100,
  });

  const rootClasses = cx(css.item, {
    [css.active]: props.value.active,
  });
  return (
    <li
      ref={rootRef}
      tabIndex={0}
      className={rootClasses}
      onClick={() => props.onClick && props.onClick(props.value)}
    >
      <animated.span style={styles} className={css.itemContent}>
        <span className={css.wardNo}>
          <Badge>#{props.value.ward_no}</Badge>
        </span>
        <span className={css.content}>{props.value.ward_name}</span>
      </animated.span>
    </li>
  );
};
//#endregion

//#region Autocomplete Component
export interface AutocompleteProps {
  parentRef?: React.MutableRefObject<HTMLElement>;
}

interface AutocompleteState {
  list: Item[];
  activeWard: Item | null;
}

const options = {
  includeScore: true,
  keys: ["division", "sub_div", "ward_no", "ward_name"],
};

const applyMaxSize: (
  callback?: (height: number, padding: number) => void
) => Modifier<string, { modifiersData: any }> = cb => ({
  name: "applyMaxSize",
  enabled: true,
  phase: "beforeWrite",
  requires: ["maxSize"],
  fn({ state }) {
    let { height } = state.modifiersData.maxSize;
    const computedStyles = getComputedStyle(state.elements.popper);
    height = Math.max(200, height);
    state.elements.popper.style.height = `${height}px`;
    const padding = parseInt(
      computedStyles.paddingBottom.replace(/\D+/, ""),
      10
    );
    cb && cb(height, padding);
  },
});

const updateActive = (list: Item[], update: 1 | -1) => {
  let activeIndex = -1;
  list.forEach((item, index) => {
    if (item.active) {
      activeIndex = list.length + index + update;
    }
    item.active = false;
  });
  activeIndex = activeIndex === -1 ? 0 : activeIndex;
  list[activeIndex % list.length].active = true;
};

export const Autocomplete: React.FC<AutocompleteProps> = () => {
  const inputRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const popperRef = useRef<Instance>();
  const fuseRef = useRef<Fuse<WardDataJSON>>();
  const [state, updateState] = useImmer<AutocompleteState>({
    list: [],
    activeWard: null,
  });
  const open = state.list.length > 0;
  const [props, springApi] = useSpring(() => ({
    opacity: 0.5,
    y: 10,
  }));

  const updateStore = useWardStore(getUpdateState);
  const list = useWardStore(getWardList);

  const handleMeasure = useCallback(
    (height: number, padding: number) => {
      if (!listRef.current) return;
      listRef.current.style.maxHeight = `${height - padding}px`;
      springApi.start({
        opacity: open ? 1 : 0.5,
        y: open ? 0 : 10,
      });
    },
    [springApi, open]
  );

  useEffect(() => {
    const handleResize = () => {
      popperRef.current?.update();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    return () => {
      popperRef.current?.destroy();
    };
  });

  useEffect(() => {
    if (!inputRef.current || !popupRef.current) return;
    // Will fix this popper once I get time.
    popperRef.current = createPopper(inputRef.current, popupRef.current, {
      modifiers: [maxSize, applyMaxSize(handleMeasure)],
    });
    return () => {
      popperRef.current?.update();
    };
  }, [handleMeasure]);

  useEffect(() => {
    fuseRef.current = new Fuse(list, options);
  }, [list]);

  const handleChange: PropType<SearchProps, "onChange"> = ({ target }) => {
    if (!fuseRef.current) return;

    const result = fuseRef.current.search(target.value);
    updateState(draft => {
      const list: PropType<AutocompleteState, "list"> = result
        .slice(0, 5)
        .map(element => ({ ...element.item }));
      list.forEach((item, i) => i === 0 && (item.active = true));
      draft.list = list;
    });
  };

  const handleItemClick = (item?: Item) => {
    if (!item) return;
    updateState(draft => {
      draft.list = [];
      draft.activeWard = item;
    });
    updateStore("selected", item);
  };

  const handleKeyDownUpdate: React.KeyboardEventHandler = ev => {
    if (
      ev.code === KEY_CODES.ArrowDown ||
      ev.code === KEY_CODES.KEYCODE_DPAD_DOWN
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      updateState(draft => {
        updateActive(draft.list, 1);
      });
    }
    if (
      ev.code === KEY_CODES.ArrowUp ||
      ev.code === KEY_CODES.KEYCODE_DPAD_UP
    ) {
      ev.preventDefault();
      ev.stopPropagation();
      updateState(draft => {
        updateActive(draft.list, -1);
      });
    }

    if (ev.code === KEY_CODES.Enter) {
      handleItemClick(state.list.find(item => item.active));
    }
  };

  const handleSearchKeyDown: React.KeyboardEventHandler = ev => {
    handleKeyDownUpdate(ev);
  };

  const handleKeyDown: React.KeyboardEventHandler = ev => {
    handleKeyDownUpdate(ev);
  };

  const listClasses = cx(css.listWrapper, {
    show: open,
  });

  return (
    <div className={css.root}>
      <Search
        ref={inputRef}
        className={css.input}
        placeholder={
          <>
            <span>Enter </span>
            <b>
              <i>“Ward”</i>
            </b>
            <span> or </span>
            <b>
              <i>“District”</i>
            </b>
          </>
        }
        value={state.activeWard?.ward_name}
        onChange={handleChange}
        onKeyDown={handleSearchKeyDown}
      />
      <div ref={popupRef} className={listClasses} onKeyDown={handleKeyDown}>
        <animated.ul
          ref={listRef}
          style={props}
          tabIndex={0}
          className={css.list}
        >
          {state.list.map(item => (
            <AutocompleteListItem
              key={item.ward_no}
              onClick={handleItemClick}
              value={item}
            />
          ))}
        </animated.ul>
      </div>
    </div>
  );
};
//#endregion
