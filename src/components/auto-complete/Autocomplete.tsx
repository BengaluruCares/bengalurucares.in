import React, { useEffect, useRef } from "react";
// Do not import directly from @popperjs/core, read the docs
import { createPopper } from "@popperjs/core/lib/createPopper";
import Fuse from "fuse.js";

import useWardStore, { getWardList } from "@src/stores/ward.store";
import { Search } from "@src/components";
import css from "./Autocomplete.module.css";
import { SearchProps } from "../Search";
import { useImmer } from "use-immer";
import { WardDataJSON } from "../noop";
import { cx } from "@src/utils";

export interface AutocompleteListItem extends CommonReactProps {
  value: WardDataJSON;
}

export const AutocompleteListItem: React.FC<AutocompleteListItem> = props => {
  return <li className={css.item}>{props.value.ward_name}</li>;
};

//#region Autocomplete Component
interface AutocompleteState {
  list: Fuse.FuseResult<WardDataJSON>[];
}

const options = {
  includeScore: true,
  keys: ["division", "sub_div", "ward_no", "ward_name"],
};

export const Autocomplete: React.FC = () => {
  const inputRef = useRef<HTMLSpanElement>(null);
  const popupRef = useRef<HTMLUListElement>(null);
  const fuseRef = useRef<Fuse<WardDataJSON>>();
  const [state, updateState] = useImmer<AutocompleteState>({
    list: [],
  });

  const list = useWardStore(getWardList);

  useEffect(() => {
    if (!inputRef.current || !popupRef.current) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const popper = createPopper(inputRef.current, popupRef.current);
  }, []);

  useEffect(() => {
    fuseRef.current = new Fuse(list, options);
  }, [list]);

  const handleChange: PropType<SearchProps, "onChange"> = ({ target }) => {
    if (!fuseRef.current) return;

    const result = fuseRef.current.search(target.value);
    updateState(draft => {
      draft.list = result.slice(0, 5);
    });
  };

  const listClasses = cx(css.list, {
    [css.show]: state.list.length > 0,
  });

  return (
    <div className={css.root}>
      <Search ref={inputRef} onChange={handleChange} />
      <ul ref={popupRef} className={listClasses}>
        {state.list.map(({ item }) => (
          <AutocompleteListItem key={item.ward_no} value={item} />
        ))}
      </ul>
    </div>
  );
};
//#endregion
