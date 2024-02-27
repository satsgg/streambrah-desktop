import { StateCreator } from "zustand";

type Status = "planned" | "live" | "ended";

type State = {
  nostr: {
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
  setNostrValues: (values: {}) => void;
  resetNostr: () => void;
};

export type NostrSlice = State & Actions;

const initialState = {
  nostr: {
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
  },
};

export const createNostrSlice: StateCreator<NostrSlice, [], [], NostrSlice> = (
  set,
  get
) => ({
  ...initialState,
  setIdentifier: (d: string) => set({ nostr: { ...get().nostr, d: d } }),
  setTitle: (title: string) => set({ nostr: { ...get().nostr, title: title } }),
  setSummary: (summary: string) =>
    set({ nostr: { ...get().nostr, summary: summary } }),
  setImage: (image: string) => set({ nostr: { ...get().nostr, image: image } }),
  setStreaming: (streaming: string) =>
    set({ nostr: { ...get().nostr, streaming: streaming } }),
  setRecording: (recording: string) =>
    set({ nostr: { ...get().nostr, recording: recording } }),
  setStarts: (starts: string) =>
    set({ nostr: { ...get().nostr, starts: starts } }),
  setEnds: (ends: string) => set({ nostr: { ...get().nostr, ends: ends } }),
  setStatus: (status: Status) =>
    set({ nostr: { ...get().nostr, status: status } }),
  setCurrentParticipants: (currentParticipants: string) =>
    set({
      nostr: { ...get().nostr, currentParticipants: currentParticipants },
    }),
  setTotalParticipants: (totalParticipants: string) =>
    set({ nostr: { ...get().nostr, totalParticipants: totalParticipants } }),
  setTags: (t: string[]) => set({ nostr: { ...get().nostr, t: t } }),
  setParticipants: (p: string[]) => set({ nostr: { ...get().nostr, p: p } }),
  setRelays: (relays: string[]) =>
    set({ nostr: { ...get().nostr, relays: relays } }),
  setNostrValues: (values: {}) => set({ nostr: { ...get().nostr, ...values } }),
  resetNostr: () => set(initialState),
});
