export default function StreamPreview() {
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
    </div>
  );
}
