import useObsStore from "@/store/obsStore";
import OBSWebSocket from "obs-websocket-js";
import { useEffect, useRef } from "react";

export default function useObs() {
  const obsStore = useObsStore();
  const obs = useRef(new OBSWebSocket());

  useEffect(() => {
    const connect = async () => {
      try {
        console.debug("connecting");
        // await obs.current.connect("ws://192.168.1.244", "password");
        // await obs.current.connect("ws://192.168.1.244");
        // TODO: If using password, prompt user for it...
        // await obs.current.connect();
        await obs.current.connect("ws://127.0.0.1:4455", "y7KUok2SygddbNVI");
        // ws://127.0.0.1:4455/
        // const obs = useRef(new OBSWebSocket());
      } catch (error) {
        console.error("error", error);
      }
    };
    connect();

    obs.current.on("ConnectionOpened", () => {
      console.debug("connected!");
      // TODO: Should check if stream is running here...
      // might have refreshed stream manager while stream was running
      obsStore.setConnected(true);
      // setConnected(true);
    });

    obs.current.on("StreamStateChanged", async (event) => {
      if (event.outputState === "OBS_WEBSOCKET_OUTPUT_STARTED") {
        console.debug("output started", event);
        obsStore.setLive(true);
        // setStreamConfig((prev) => {
        //   return {
        //     ...prev,
        //     prevStatus: "ended",
        //     status: "live",
        //     starts: `${Math.floor(Date.now() / 1000)}`,
        //   };
        // });
      }
      if (event.outputState === "OBS_WEBSOCKET_OUTPUT_STOPPED") {
        console.debug("output started", event);
        obsStore.setLive(false);
        // setStreamConfig((prev) => {
        //   return {
        //     ...prev,
        //     prevStatus: "live",
        //     status: "ended",
        //   };
        // });
      }
    });

    return () => {
      // this breaks connection with react strict mode true
      const disconnect = async () => {
        await obs.current.disconnect();
        // setConnected(false);
        obsStore.setConnected(false);
      };
      disconnect();
    };
  }, []);

  return { obsConnected: obsStore.connected, obsLive: obsStore.live };
}
