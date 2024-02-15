"use client";
import { useZodForm } from "./useZodForm";
import { getPublicKey } from "nostr-tools/pure";
import { decode } from "nostr-tools/nip19";
import { z } from "zod";
import { validHexPrivkey, validNsecKey } from "./util";
import useUserStore from "@/store/userStore";

export default function Login({ close }: { close: () => void }) {
  const { setUserState } = useUserStore();

  const privkeyValidator = (key: string) => {
    if (key.startsWith("nsec1")) {
      if (!validNsecKey(key)) return false;
    } else if (!validHexPrivkey(key)) {
      return false;
    }
    return true;
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useZodForm({
    mode: "onChange",
    schema: z.object({
      key: z.string().refine(privkeyValidator, {
        message: "Invalid key",
      }),
    }),
    defaultValues: {
      key: "",
    },
  });

  // TODO: Save private key to keychain
  const onSubmit = (data: { key: string }) => {
    const privkey = data.key;
    if (privkey.startsWith("nsec1")) {
      let { type, data: nipData } = decode(privkey);
      const pubkey = getPublicKey(nipData as Uint8Array);
      setUserState(pubkey, "local");
      // setPrivkey(nipData as string);
      close();
      return;
    }
    // privkey is 64 bytes, getPublicKey is expecting 32 bytes
    //@ts-ignore
    const pubkey = getPublicKey(privkey);
    setUserState(pubkey, "local");
    close();
    // setPrivkey(privkey);
  };

  return (
    <div className="flex flex-col py-2 px-4 gap-2">
      <form spellCheck={false} onSubmit={handleSubmit(onSubmit)}>
        <input
          className={`
            ${errors.key && "focus:border-red-500"}
            focus:shadow-outline h-8 w-full resize-none appearance-none rounded border border-gray-500 bg-gray-600 py-2 px-3 leading-tight text-white shadow placeholder:italic focus:border-primary focus:bg-slate-900 focus:outline-none
          `}
          type="text"
          placeholder="nsec / hex private key"
          autoComplete="off"
          {...register("key")}
        />
        {errors.key && <p className="text-sm ">{errors.key.message}</p>}
      </form>
      <button
        className="px-2 py-1 rounded font-semibold bg-red-500 disabled:bg-gray-500"
        disabled={!isValid}
        onClick={handleSubmit(onSubmit)}
      >
        Submit
      </button>
    </div>
  );
}
