import React from "react";

import { Search, BrandHeading, FetchWards } from "./components";

import css from "./App.module.css";

export const App = () => {
  return (
    <div className={css.root}>
      <FetchWards />
      <BrandHeading className={css.brandTitle} />
      <Search />
    </div>
  );
};
