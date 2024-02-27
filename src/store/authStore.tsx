import { StateCreator } from "zustand";

type AuthType = "local" | "nip46";

type State = {
  auth: {
    pubkey: string;
    authType: AuthType;
  };
};

type Actions = {
  setUserState: (pubkey: string, authType: AuthType) => void;
  logout: () => void;
};

export type AuthSlice = State & Actions;

const initialState = {
  auth: {
    pubkey: "",
    authType: "local" as const,
  },
};

export const createAuthSlice: StateCreator<AuthSlice, [], [], AuthSlice> = (
  set
) => ({
  ...initialState,
  setUserState: (pubkey: string, authType: AuthType) => {
    set({ auth: { pubkey: pubkey, authType: authType } });
  },
  logout: () => {
    // NOTE: useEffect switches key name back to defaultUser before we reset here
    set(initialState);
  },
});
