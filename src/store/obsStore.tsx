import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  connected: boolean;
  live: boolean;
  settings: {
    ip: string;
    port: string;
    password: string;
  };
};

type Actions = {
  setObsSettingsState: (ip: string, port: string, password: string) => void;
  setConnected: (connected: boolean) => void;
  setLive: (live: boolean) => void;
};

const initialState = {
  connected: false,
  live: false,
  settings: {
    ip: "127.0.0.1",
    port: "4455",
    password: "",
  },
};

export const useObsStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setObsSettingsState: (ip: string, port: string, password: string) =>
        set({ settings: { ip: ip, port: port, password: password } }),
      setConnected: (connected: boolean) => set({ connected: connected }),
      setLive: (live: boolean) => set({ live: live }),
    }),
    {
      name: "obs",
    }
  )
);

export default useObsStore;
