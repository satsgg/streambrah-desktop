import { create } from "zustand";
import { persist } from "zustand/middleware";

type Status = "planned" | "live" | "ended";

type State = {
  d: string;
  title: string;
  summary: string;
  image: string;
  streaming: string;
  recording: string;
  starts: string;
  ends: string;
  status: Status;
  currentParticipants: string;
  totalParticipants: string;
  p: string[];
  t: string[];
  relays: string[];
};

type Actions = {
  setIdentifier: (d: string) => void;
  setTitle: (title: string) => void;
  setSummary: (summary: string) => void;
  setImage: (image: string) => void;
  setStreaming: (streaming: string) => void;
  setRecording: (recording: string) => void;
  setStarts: (starts: string) => void;
  setEnds: (ends: string) => void;
  setStatus: (status: Status) => void;
  setCurrentParticipants: (currentParticipants: string) => void;
  setTotalParticipants: (totalParticipants: string) => void;
  setTags: (t: string[]) => void;
  setParticipants: (p: string[]) => void;
  setRelays: (relays: string[]) => void;
};

const initialState = {
  d: "",
  title: "",
  summary: "",
  image: "",
  streaming: "",
  recording: "",
  starts: "",
  ends: "",
  status: "planned" as const,
  currentParticipants: "0",
  totalParticipants: "0",
  t: [],
  p: [],
  relays: [],
};

export const useNostrStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setIdentifier: (d: string) => set({ d: d }),
      setTitle: (title: string) => set({ title: title }),
      setSummary: (summary: string) => set({ summary: summary }),
      setImage: (image: string) => set({ image: image }),
      setStreaming: (streaming: string) => set({ streaming: streaming }),
      setRecording: (recording: string) => set({ recording: recording }),
      setStarts: (starts: string) => set({ starts: starts }),
      setEnds: (ends: string) => set({ ends: ends }),
      setStatus: (status: Status) => set({ status: status }),
      setCurrentParticipants: (currentParticipants: string) =>
        set({ currentParticipants: currentParticipants }),
      setTotalParticipants: (totalParticipants: string) =>
        set({ totalParticipants: totalParticipants }),
      setTags: (t: string[]) => set({ t: t }),
      setParticipants: (p: string[]) => set({ p: p }),
      setRelays: (relays: string[]) => set({ relays: relays }),
    }),
    {
      name: "default-nostr",
    }
  )
);

export default useNostrStore;
