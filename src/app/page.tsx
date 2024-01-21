"use client";
import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState("");
  const getState = async () => {
    console.debug("getting state");
    const v: string = await invoke("get_state");
    setValue(v);
    console.debug("value", v);
  };

  const setState = async () => {
    console.debug("setting state");
    const v: string = await invoke("set_state", { newValue: "test" });
    console.debug("value", v);
    setValue(v);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <p>{value}</p>
      <button onClick={async () => await getState()}>get state</button>
      <button onClick={async () => await setState()}>set state</button>
    </main>
  );
}
