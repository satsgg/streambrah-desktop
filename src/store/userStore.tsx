import { StateCreator, create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthSlice, createAuthSlice } from "./authStore";
import { NostrSlice, createNostrSlice } from "./nostrStore";

interface StoreSlice {
  isHydrated: boolean;
  setHydrated: () => void;
  logout: () => void;
}
const createStoreSlice: StateCreator<
  StoreSlice & AuthSlice & NostrSlice,
  [],
  [],
  StoreSlice
> = (set, get) => ({
  isHydrated: false,
  setHydrated: () => set({ isHydrated: true }),
  logout: () => {
    get().resetAuth();
    get().resetNostr();
  },
});

const useUserStore = create<AuthSlice & NostrSlice & StoreSlice>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createNostrSlice(...a),
      ...createStoreSlice(...a),
    }),
    {
      name: "defaultUser",
      onRehydrateStorage: (state) => {
        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            state?.setHydrated();
          }
        };
      },
      // partialize: (state) => ({ settings: state.settings }),
    }
  )
);

export default useUserStore;
