import { cx } from "@src/utils";
import css from "./Badge.module.css";

export const Badge: React.FC<CommonReactProps> = ({ className, children }) => {
  const rootClasses = cx(css.root, className);
  return <span className={rootClasses}>{children}</span>;
};
