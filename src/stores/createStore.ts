import create, { State, StateCreator, UseStore } from "zustand";
import { devtools } from "zustand/middleware";
import { produce, Draft } from "immer";

const isProd = /^prod/i.test(process.env.NODE_ENV || "");

// Log every time state is changed
const log = <T extends State>(config: StateCreator<T>): StateCreator<T> => (
  set,
  get,
  api
) =>
  config(
    args => {
      set(args);
      // eslint-disable-next-line no-console
      console.log("  %cNew State:: ", "color: #ef9a9a", get().state);
    },
    get,
    api
  );

// Turn the set method into an immer proxy
const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config(fn => set(produce<T>(fn)), get, api);

export const createStore = <T extends State>(
  devtoolsName: string,
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): UseStore<T> => {
  if (isProd) {
    return create(immer(config));
  } else {
    return create(devtools(log(immer(config)), devtoolsName));
  }
};
