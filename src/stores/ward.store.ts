import { State } from "zustand";
import { createStore } from "@src/stores/createStore";
import { WardDataJSON } from "@src/components/noop";

export interface WardStoreState {
  wardList: WardDataJSON[];
}

const INITIAL_STATE: WardStoreState = {
  wardList: [],
};

export interface WardStore extends State {
  state: WardStoreState;
  updateState: (key: keyof WardStoreState, value: any) => void;
}

const useStore = createStore<WardStore>("WardStore", set => ({
  state: INITIAL_STATE,
  updateState: (key, value) => {
    set(store => {
      store.state[key] = value;
    });
  },
}));

export default useStore;

export const getUpdateState = (
  store: WardStore
): PropType<WardStore, "updateState"> => store.updateState;
