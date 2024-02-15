import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthType = "local" | "nip46";

type State = {
  pubkey: string;
  authType: AuthType;
};

type Actions = {
  setUserState: (pubkey: string, authType: AuthType) => void;
};

const initialState = {
  pubkey: "",
  authType: "local" as const,
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserState: (pubkey: string, authType: AuthType) =>
        set({ pubkey: pubkey, authType: authType }),
    }),
    {
      name: "user",
    }
  )
);

export default useUserStore;
