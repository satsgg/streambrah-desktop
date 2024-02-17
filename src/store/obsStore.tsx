import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  connected: boolean;
  error: string;
  live: boolean;
  settings: {
    ip: string;
    port: string;
    password: string;
  };
  hydrated: boolean;
};

type Actions = {
  setObsSettingsState: (ip: string, port: string, password: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string) => void;
  setLive: (live: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
};

const initialState = {
  connected: false,
  error: "",
  live: false,
  settings: {
    ip: "127.0.0.1",
    port: "4455",
    password: "",
  },
  hydrated: false,
};

export const useObsStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setObsSettingsState: (ip: string, port: string, password: string) =>
        set({ settings: { ip: ip, port: port, password: password } }),
      setConnected: (connected: boolean) => set({ connected: connected }),
      setError: (error: string) => set({ error: error }),
      setLive: (live: boolean) => set({ live: live }),
      setHydrated: (hydrated: boolean) => set({ hydrated: hydrated }),
    }),
    {
      name: "obs",
      onRehydrateStorage: (state) => {
        // Called after rehydration
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished");
            state?.setHydrated(true);
          }
        };
      },
      // TODO: Partialize.. don't store connected and hydrated in localStorage
    }
  )
);

export default useObsStore;
