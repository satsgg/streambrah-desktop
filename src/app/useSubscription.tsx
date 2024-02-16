import { useEffect, useState } from "react";
import { Pool } from "./pool";
import { Filter } from "nostr-tools/filter";
import { Event } from "nostr-tools/core";

export default function useSubscription(relays: string[], filters: Filter[]) {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    if (relays.length === 0 || filters.length === 0) return;
    let sub = Pool.subscribeMany(relays, filters, {
      onevent(event) {
        setEvents((prevEvents) => {
          if (prevEvents.some((a) => a.id === event.id)) {
            return prevEvents;
          }
          return [...prevEvents, event];
        });
      },
    });
    return () => {
      Pool.close(relays);
    };
  }, [relays, JSON.stringify(filters)]);

  return events;
}
