import { useEffect, useRef, useState } from "react";
import { Pool } from "./pool";
import { Filter } from "nostr-tools/filter";
import { Event } from "nostr-tools/core";
import { insertEventIntoAscendingList } from "nostr-tools/utils";

export default function useSubscription(relays: string[], filters: Filter[]) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    console.debug("subbing");
    if (relays.length === 0 || filters.length === 0) return;
    let sub = Pool.subscribeMany(relays, filters, {
      onevent(event) {
        setEvents((prevEvents) => {
          if (prevEvents.some((a) => a.id === event.id)) {
            return prevEvents;
          }
          // return insertEventIntoAscendingList([...prevEvents], event);
          return [...prevEvents, event];
        });
      },
    });
    // console.debug("sub", sub);

    // return () => {
    //   Pool.close(relays);
    // };
  }, [relays, JSON.stringify(filters)]);

  return events;
}
