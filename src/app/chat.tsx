import { useRef } from "react";
import useSubscription from "./useSubscription";
import { fmtMsg } from "./util";
import useChatLiveModeScrolling from "./useChatLiveModeScrolling";
import ChatPausedAlert from "./chatPausedAlert";

const relays = ["wss://relay.damus.io", "wss://nostr.fmt.wiz.biz"];

export default function Chat() {
  const now = useRef(Math.floor(Date.now() / 1000));

  const chatMessages = useSubscription(relays, [
    {
      // kinds: [9735],
      kinds: [1],
      // "#p": [pubkey || ""],
      since: now.current,
      // since: now.current - 1000 * 60 * 60 * 1,
    },
  ]);

  const { chatMessagesBoxRef, isLiveModeEnabled, scrollNewMessages } =
    useChatLiveModeScrolling<HTMLDivElement>(chatMessages);

  return (
    <div className="flex flex-col w-1/4">
      <div className="flex justify-center border-b">
        <p>Chat</p>
      </div>
      <div className="relative">
        <div
          className="max-h-[calc(50vh)] overflow-y-auto"
          ref={chatMessagesBoxRef}
        >
          {chatMessages.map((event) => (
            <div key={event.id} className="px-2 py-1 break-words">
              {fmtMsg(event.content, 250)}
            </div>
          ))}
        </div>
        {!isLiveModeEnabled && (
          <ChatPausedAlert
            onClick={scrollNewMessages}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 pb-3"
          />
        )}
      </div>
    </div>
  );
}
