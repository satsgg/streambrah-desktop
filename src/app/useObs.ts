"use client";
import useObsStore from "@/store/obsStore";
import OBSWebSocket, { OBSWebSocketError } from "obs-websocket-js";
import { useEffect, useRef } from "react";

export default function useObs() {
  const obsStore = useObsStore();
  const obs = useRef(new OBSWebSocket());

  useEffect(() => {
    if (!obsStore.hydrated) {
      console.debug("not hydrated... skipping ");
      return;
    }
    obs.current.on("ConnectionOpened", () => {
      console.debug("ConnectionOpened");
      obsStore.setConnected(true);
    });

    obs.current.on("ConnectionError", () => {
      console.error("ConnectionError");
    });

    obs.current.on("ConnectionClosed", () => {
      console.warn("ConnectionClosed");
      obsStore.setConnected(false);
    });

    const connect = async () => {
      console.debug(
        "connecting",
        obsStore.settings.ip,
        obsStore.settings.port,
        obsStore.settings.password
      );
      try {
        let conn = await obs.current.connect(
          `ws://${obsStore.settings.ip}:${obsStore.settings.port}`,
          obsStore.settings.password
        );
        console.debug("conn", conn);
        obsStore.setError("");
      } catch (error: any) {
        console.error("failed to connect to OBS websocket");
        if (error instanceof OBSWebSocketError) {
          console.debug("error.code", error.code);
          console.debug("error.cause", error.cause);
          console.debug("error.message", error.message);
          obsStore.setError(error.message);
        }
      }
    };

    connect();

    return () => {
      // this breaks connection with react strict mode true
      const disconnect = async () => {
        console.debug("disconnecting");
        await obs.current.disconnect();
        obsStore.setConnected(false);
        // TODO: set ref to null?
      };
      disconnect();
    };
  }, [
    obsStore.settings.ip,
    obsStore.settings.port,
    obsStore.settings.password,
    obsStore.hydrated,
  ]);

  return obs.current;
}
