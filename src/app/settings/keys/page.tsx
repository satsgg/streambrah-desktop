"use client";
import useUserStore from "@/store/userStore";
import Clipboard from "@/svgs/clipboard.svg";
import Checkmark from "@/svgs/checkmark.svg";
import EyeHidden from "@/svgs/eyeHidden.svg";
import { useState } from "react";
import { npubEncode, nsecEncode } from "nostr-tools/nip19";
import { invoke } from "@tauri-apps/api";
import { hexToBytes } from "@noble/hashes/utils";

export default function Keys() {
  const pubkey = useUserStore((state) => state.auth.pubkey);
  const [nsec, setNsec] = useState("");
  const [pubkeyCopied, setPubkeyCopied] = useState(false);
  const [privateKeyCopied, setPrivateKeyCopied] = useState(false);
  const npub = pubkey ? npubEncode(pubkey) : "";

  const handlePubkeyCopy = async () => {
    await navigator.clipboard.writeText(npub);
    setPubkeyCopied(true);
    setTimeout(() => {
      setPubkeyCopied(false);
    }, 3000);
  };

  const getPrivateKey = async () => {
    try {
      const privatekey: string = await invoke("get_private_key", {
        publicKey: pubkey,
      });
      const hexPrivatekey = hexToBytes(privatekey);
      const nsec1 = nsecEncode(hexPrivatekey);
      return nsec1;
    } catch (e: any) {
      // cancel / other errors
      console.error(e);
      return "";
    }
  };

  const handleCopyPrivateKey = async () => {
    await navigator.clipboard.writeText(nsec || (await getPrivateKey()));
    setPrivateKeyCopied(true);
    setTimeout(() => {
      setPrivateKeyCopied(false);
    }, 3000);
  };

  const handleShowPrivateKey = async () => {
    if (nsec) {
      setNsec("");
      return;
    }
    setNsec(await getPrivateKey());
  };

  return (
    <div className="px-6 py-6 h-full">
      <div className="flex flex-col gap-4 bg-stone-900 w-full lg:w-4/5 xl:w-2/3 2xl:w-1/2 rounded py-4 px-6">
        <div className="flex flex-col gap-2">
          <label className="capitalize">public key</label>

          <div className="flex border rounded px-4 py-1 justify-between items-center">
            <p className="truncate">{npub}</p>
            <div className="inline-flex items-center gap-2">
              <button
                className="rounded px-2 py-1 enabled:hover:bg-stone-800"
                disabled={!pubkey}
                onClick={async () => await handlePubkeyCopy()}
              >
                {pubkeyCopied ? (
                  <Checkmark width={24} height={24} className="stroke-white" />
                ) : (
                  <Clipboard width={24} height={24} className="stroke-white" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="capitalize">private key</label>
          <div>
            <div className="flex border rounded px-4 py-1 justify-between items-center">
              <p className="truncate">
                {nsec || (pubkey ? "*".repeat(64) : "")}
              </p>
              <div className="inline-flex items-center gap-2">
                <button
                  className="rounded px-2 py-1 enabled:hover:bg-stone-800"
                  disabled={!pubkey}
                  onClick={async () => await handleShowPrivateKey()}
                >
                  <EyeHidden width={24} height={24} className="stroke-white" />
                </button>
                <button
                  className="rounded px-2 py-1 enabled:hover:bg-stone-800"
                  disabled={!pubkey}
                  onClick={async () => await handleCopyPrivateKey()}
                >
                  {privateKeyCopied ? (
                    <Checkmark
                      width={24}
                      height={24}
                      className="stroke-white"
                    />
                  ) : (
                    <Clipboard
                      width={24}
                      height={24}
                      className="stroke-white"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
