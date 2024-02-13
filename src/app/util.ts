import { Event } from "nostr-tools/core";

export const MAX_MSG_LEN = 200;
export const fmtMsg = (content: string, length: number = MAX_MSG_LEN) => {
  if (content.length > length) {
    return content.slice(0, length).trim() + "...";
  }
  return content;
};

export type ChatMessage = {
  pubkey: string;
  createdAt: number;
  id: string;
  sig: string;
  content: string;
};

export const parseChatMessage = (message: Event): ChatMessage => {
  const chatMessage: ChatMessage = {
    pubkey: message.pubkey,
    createdAt: message.created_at,
    id: message.id,
    sig: message.sig,
    content: fmtMsg(message.content, 250),
  };

  return chatMessage;
};

export type ZapRequest = {
  pubkey: string;
  created_at: number;
  id: string;
  sig: string;
  content: string;
  // tags
  relays?: string[];
  amount?: string;
  lnurl?: string;
  p: string;
  e?: string;
  a?: string;
};

export const parseZapRequest = (zapRequest: Event): ZapRequest | null => {
  try {
    const pTag = zapRequest.tags.find(([t, v]) => t === "p" && v);
    if (!pTag || !pTag[1]) return null;

    let parsedZapRequest: ZapRequest = {
      pubkey: zapRequest.pubkey,
      created_at: zapRequest.created_at,
      id: zapRequest.id,
      sig: zapRequest.sig,
      content: zapRequest.content,
      p: pTag[1],
    };

    const relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
    if (relays && relays[1]) parsedZapRequest["relays"] = relays.splice(1);

    const amount = zapRequest.tags.find(([t, v]) => t === "amount" && v);
    if (amount && amount[1]) parsedZapRequest["amount"] = amount[1];

    const lnurl = zapRequest.tags.find(([t, v]) => t === "lnurl" && v);
    if (lnurl && lnurl[1]) parsedZapRequest["lnurl"] = lnurl[1];

    const e = zapRequest.tags.find(([t, v]) => t === "e" && v);
    if (e && e[1]) parsedZapRequest["e"] = e[1];

    const a = zapRequest.tags.find(([t, v]) => t === "a" && v);
    if (a && a[1]) parsedZapRequest["a"] = a[1];

    return parsedZapRequest;
  } catch (e) {
    console.error("Invalid zap request event");
  }

  return null;
};
