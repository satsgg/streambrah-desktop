import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuState } from "./types";

type State = {
  menu: {
    collapsed: boolean;
    hidden: boolean;
  };
};

type Actions = {
  setMenuState: (state: MenuState) => void;
};

const initialState = {
  menu: {
    collapsed: false,
    hidden: false,
  },
};

export const useLayoutStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setMenuState: (state: MenuState) => set({ menu: state }),
    }),
    {
      name: "layout",
    }
  )
);

export default useLayoutStore;
