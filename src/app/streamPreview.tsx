import useUserStore from "@/store/userStore";

export default function StreamPreview() {
  const nostrStore = useUserStore((state) => state.nostr);
  return (
    <div className="flex flex-col w-1/2 bg-stone-900">
      <div className="flex justify-center capitalize py-2 border border-black bg-stone-900">
        stream preview
      </div>
      <div className="aspect-video">
        <video controls>
          <source
            src="https://pokemon.sats.gg/hls/stream.m3u8"
            type="application/x-mpegURL"
          />
        </video>
      </div>

      <div className="flex justify-between p-2">
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-[50%] bg-red-500" />
          <div className="flex flex-col">
            <p className="text-semibold">{nostrStore.title || "Title"}</p>
            <p className="text-sm">{nostrStore.summary || "Summary"}</p>
            <p className="text-sm">{nostrStore.t}</p>
          </div>
        </div>

        <div>
          <p>Offline</p>
        </div>
      </div>
    </div>
  );
}
