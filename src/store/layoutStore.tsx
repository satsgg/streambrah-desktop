import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MenuState } from "./types";

type State = {
  menu: MenuState;
};

type Actions = {
  setMenuState: (state: MenuState) => void;
};

const initialState = {
  menu: "expanded" as const,
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
