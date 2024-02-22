import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthType = "local" | "nip46";

type State = {
  pubkey: string;
  authType: AuthType;
  hydrated: boolean;
};

type Actions = {
  setUserState: (pubkey: string, authType: AuthType) => void;
  logout: () => void;
  setHydrated: () => void;
};

const initialState = {
  pubkey: "",
  authType: "local" as const,
  hydrated: false,
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setUserState: (pubkey: string, authType: AuthType) => {
        set({ pubkey: pubkey, authType: authType });
      },
      logout: () => {
        set(initialState);
      },
      setHydrated: () => {
        set({ hydrated: true });
      },
    }),
    {
      name: "user",
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            state?.setHydrated();
          }
        };
      },
      partialize: (state) => ({
        pubkey: state.pubkey,
        authType: state.authType,
      }),
    }
  )
);

export default useUserStore;
