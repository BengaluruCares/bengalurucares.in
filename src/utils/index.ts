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

/**
 * Controlled Fetch helps to abort an ongoing fetch request.
 * This mostly helps for unnecessary effects when React Component
 * unmounts.
 */
export const controlledFetch = <T>(
  input: RequestInfo
): {
  promise: Promise<T>;
  controller: AbortController;
} => {
  const controller = new AbortController();
  const res = fetch(input, { signal: controller.signal }).then(res =>
    res.json()
  );
  return {
    promise: res,
    controller,
  };
};
