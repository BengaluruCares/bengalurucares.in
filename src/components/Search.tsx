import React from "react";
import { useImmer } from "use-immer";

import { cx } from "@src/utils";
import css from "./Search.module.css";

export interface SearchProps extends CommonReactProps {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Search = React.forwardRef<HTMLSpanElement, SearchProps>(
  (props, ref) => {
    const [state, updateState] = useImmer({
      focused: false,
    });

    const handleFocus = (update: boolean) => {
      updateState(draft => {
        draft.focused = update;
      });
    };

    const rootClasses = cx(css.root, props.className, {
      [css.focus]: state.focused,
    });
    return (
      <span ref={ref} className={rootClasses}>
        <input
          onBlur={() => handleFocus(false)}
          onFocus={() => handleFocus(true)}
          onChange={props.onChange}
          onKeyDown={props.onKeyDown}
          type="text"
          className={css.input}
        />
      </span>
    );
  }
);

Search.displayName = "ForwardRef(Search)";
