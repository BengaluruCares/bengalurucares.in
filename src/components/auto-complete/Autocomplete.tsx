import React, { useEffect, useRef } from "react";
// Do not import directly from @popperjs/core, read the docs
import { createPopper } from "@popperjs/core/lib/createPopper";
import type { Instance, Modifier } from "@popperjs/core";
import maxSize from "popper-max-size-modifier";
import Fuse from "fuse.js";

import useWardStore, { getWardList } from "@src/stores/ward.store";
import { Search } from "@src/components";
import css from "./Autocomplete.module.css";
import { SearchProps } from "../Search";
import { useImmer } from "use-immer";
import { WardDataJSON } from "../noop";
import { cx, KEY_CODES } from "@src/utils";

type Item = WardDataJSON & { active?: boolean };

export interface AutocompleteListItem extends CommonReactProps {
  value: Item;
  onClick?: (item: Item) => void;
}

export const AutocompleteListItem: React.FC<AutocompleteListItem> = props => {
  const rootRef = useRef<HTMLLIElement>(null);

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
      <span className={css.itemContent}>
        <span className={css.wardNo}>
          <span>#{props.value.ward_no}</span>
        </span>
        <span className={css.content}>{props.value.ward_name}</span>
      </span>
    </li>
  );
};

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

const applyMaxSize: Modifier<string, { modifiersData: any }> = {
  name: "applyMaxSize",
  enabled: true,
  phase: "beforeWrite",
  requires: ["maxSize"],
  fn({ state }) {
    let { height } = state.modifiersData.maxSize;
    const computedStyles = getComputedStyle(state.elements.popper);
    const child = state.elements.popper.children[0] as HTMLUListElement;
    height = Math.max(400, height);
    state.elements.popper.style.maxHeight = `${height}px`;
    child.style.maxHeight = `calc(${height}px - ${computedStyles.paddingBottom})`;
  },
};

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
  const popperRef = useRef<Instance>();
  const fuseRef = useRef<Fuse<WardDataJSON>>();
  const [state, updateState] = useImmer<AutocompleteState>({
    list: [],
    activeWard: null,
  });

  const list = useWardStore(getWardList);

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
    if (!inputRef.current || !popupRef.current) return;
    // Will fix this popper once I get time.
    popperRef.current = createPopper(inputRef.current, popupRef.current, {
      modifiers: [maxSize, applyMaxSize],
    });
    return () => {
      popperRef.current?.destroy();
    };
  }, []);

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
      draft.list = list;
    });
  };

  const handleItemClick = (item?: Item) => {
    if (!item) return;
    updateState(draft => {
      draft.list = [];
      draft.activeWard = item;
    });
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
    show: state.list.length > 0,
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
        <ul tabIndex={0} className={css.list}>
          {state.list.map(item => (
            <AutocompleteListItem
              key={item.ward_no}
              onClick={handleItemClick}
              value={item}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};
//#endregion
