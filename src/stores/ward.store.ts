import { State } from "zustand";
import { createStore } from "@src/stores/createStore";
import { WardDataJSON } from "@src/components/noop";

export interface WardStoreState {
  wardList: WardDataJSON[];
  selected: WardDataJSON | null;
}

const INITIAL_STATE: WardStoreState = {
  wardList: [],
  selected: null,
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

export const getWardList = (
  store: WardStore
): PropType<WardStoreState, "wardList"> => store.state.wardList;

export const getSelectedWard = (
  store: WardStore
): PropType<WardStoreState, "selected"> => store.state.selected;
