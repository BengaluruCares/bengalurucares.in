import React from "react";
import { cx } from "@src/utils";

import css from "./BrandHeading.module.css";

export const BrandHeading: React.FC<React.ComponentProps<"h1">> = ({
  className,
}) => {
  const rootClasses = cx(css.root, className);
  return <h1 className={rootClasses}>Bengaluru Cares</h1>;
};
