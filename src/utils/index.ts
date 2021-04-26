export function hasProperty<T extends Record<string, any>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function cx(...args: any[]): string {
  let _classnames = "";
  args.forEach(arg => {
    if (typeof arg === "string") {
      _classnames += ` ${arg}`;
    } else if (Array.isArray(arg)) {
      _classnames += " " + cx(...arg);
    } else if (typeof arg === "object") {
      _classnames +=
        " " +
        cx(
          ...Object.keys(arg).filter(key => hasProperty(arg, key) && !!arg[key])
        );
    }
  });
  return _classnames;
}
