export default function StreamPreview() {
  return (
    <div className="flex flex-col">
      <div className="aspect-video h-full w-full">
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
