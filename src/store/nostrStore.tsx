import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  d: string;
};

type Actions = {
  setIdentifier: (d: string) => void;
};

const initialState = {
  d: "",
};

export const useNostrStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setIdentifier: (d: string) => set({ d: d }),
    }),
    {
      name: "default-nostr",
    }
  )
);

export default useNostrStore;
