import React from "react";

import { Search, BrandHeading } from "./components";

import css from "./App.module.css";

export const App = () => {
  return (
    <div className={css.root}>
      <BrandHeading />
      <Search />
    </div>
  );
};
