import React, { useEffect } from "react";
import { useImmer } from "use-immer";

import { cx } from "@src/utils";
import css from "./Search.module.css";

export interface SearchProps extends CommonReactProps {
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}

export const Search = React.forwardRef<HTMLSpanElement, SearchProps>(
  (props, ref) => {
    const [state, updateState] = useImmer({
      focused: false,
      value: props.value || "",
    });

    useEffect(() => {
      updateState(draft => {
        draft.value = props.value || "";
      });
    }, [props.value]);

    const handleFocus = (update: boolean) => {
      updateState(draft => {
        draft.focused = update;
      });
    };

    const handleChange: React.ChangeEventHandler<HTMLInputElement> = ev => {
      updateState(draft => {
        draft.value = ev.target.value;
      });
      props.onChange && props.onChange(ev);
    };

    const rootClasses = cx(css.root, props.className, {
      [css.focus]: state.focused,
    });
    return (
      <span ref={ref} className={rootClasses}>
        <input
          onBlur={() => handleFocus(false)}
          onFocus={() => handleFocus(true)}
          onChange={handleChange}
          onKeyDown={props.onKeyDown}
          type="text"
          value={state.value}
          className={css.input}
        />
      </span>
    );
  }
);

Search.displayName = "ForwardRef(Search)";
