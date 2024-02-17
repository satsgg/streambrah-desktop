import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type State = {
  ws: null | OBSWebSocket;
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
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  setObsSettingsState: (ip: string, port: string, password: string) => void;
  setConnected: (connected: boolean) => void;
  setError: (error: string) => void;
  setLive: (live: boolean) => void;
  setHydrated: (hydrated: boolean) => void;
};

const initialState = {
  ws: null,
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
    (set, get) => ({
      ...initialState,
      connect: async () => {
        const { settings } = get();
        const obs = new OBSWebSocket();
        obs.on("ConnectionOpened", () => {
          console.debug("ConnectionOpened");
          // obsStore.setConnected(true);
          set({ ws: obs, connected: true, error: "" });
        });

        obs.on("ConnectionError", () => {
          console.error("ConnectionError");
        });

        obs.on("ConnectionClosed", () => {
          console.warn("ConnectionClosed");
          set({ ws: null, connected: false });
        });
        try {
          console.debug("attempting to connect to ws");
          await obs.connect(
            `ws://${settings.ip}:${settings.port}`,
            settings.password
          );
        } catch (error) {
          console.error("Failed to connect to OBS websocket");
          if (error instanceof OBSWebSocketError) {
            console.debug("error.code", error.code);
            console.debug("error.cause", error.cause);
            console.debug("error.message", error.message);
            set({ connected: false, error: error.message });
          }
        }
      },
      disconnect: async () => {
        const ws = get().ws;
        if (ws) {
          await ws.disconnect();
          set({ ws: null, connected: false });
        }
      },
      reconnect: async () => {
        const { disconnect, connect } = get();
        disconnect();
        connect();
      },
      setObsSettingsState: (ip: string, port: string, password: string) => {
        set({ settings: { ip: ip, port: port, password: password } }),
          get().reconnect();
      },
      setConnected: (connected: boolean) => set({ connected: connected }),
      setError: (error: string) => set({ error: error }),
      setLive: (live: boolean) => set({ live: live }),
      setHydrated: (hydrated: boolean) => set({ hydrated: true }),
    }),
    {
      name: "obs",
      // storage: createJSONStorage(() => AsyncStorage),
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used

      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.debug("hydrated", state?.settings);
            state?.setHydrated(true);
            state?.connect();
          }
        };
      },
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useObsStore;
