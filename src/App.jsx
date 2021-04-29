import { BrandHeading, FetchWards, Autocomplete, WardCard } from "./components";

import css from "./App.module.css";

export const App = () => {
  return (
    <div className={css.root}>
      <FetchWards />
      <BrandHeading className={css.brandTitle} />
      <Autocomplete />
      <div className={css.card}>
        <WardCard />
      </div>
    </div>
  );
};
