import React from "react";
import { useImmer } from "use-immer";

import { cx } from "@src/utils";
import css from "./Search.module.css";

export const Search: React.FC = () => {
  const [state, updateState] = useImmer({
    focused: false,
  });

  const handleFocus = (update: boolean) => {
    updateState(draft => {
      draft.focused = update;
    });
  };

  const rootClasses = cx(css.root, {
    [css.focus]: state.focused,
  });
  return (
    <span className={rootClasses}>
      <input
        onBlur={() => handleFocus(false)}
        onFocus={() => handleFocus(true)}
        type="text"
        className={css.input}
      />
    </span>
  );
};
