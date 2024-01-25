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

  const storePrivateKey = async () => {
    console.debug("storing private key");
    try {
      const res = await invoke("store_private_key", { privateKey: "key" });
      console.debug("res", res);
    } catch (e: any) {
      console.error("failed to store private key", e);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{nostrState.pubkey}</p>
      <p>{nostrState.identifier}</p>
      <button onClick={async () => await getState()}>get state</button>
      <button onClick={async () => await setState()}>set state</button>
      <button onClick={async () => await storePrivateKey()}>
        store private key
      </button>
    </main>
  );
}
