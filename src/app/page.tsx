"use client";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

type NostrState = {
  pubkey: string;
  identifier: string;
};

export default function Home() {
  const [nostrState, setNostrState] = useState({
    pubkey: "",
    identifier: "",
  });
  const getState = async () => {
    const state: NostrState = await invoke("get_state");
    console.debug("state", state);
    setNostrState({
      pubkey: state.pubkey,
      identifier: state.identifier,
    });
  };

  const setState = async () => {
    console.debug("setting state");
    const state: NostrState = await invoke("set_state", {
      pubkey: "pubkey123",
      identifier: "identifier123",
    });
    setNostrState({
      pubkey: state.pubkey,
      identifier: state.identifier,
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{nostrState.pubkey}</p>
      <p>{nostrState.identifier}</p>
      <button onClick={async () => await getState()}>get state</button>
      <button onClick={async () => await setState()}>set state</button>
    </main>
  );
}
