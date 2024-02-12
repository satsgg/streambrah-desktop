export default function StreamPreview() {
  return (
    <div className="flex flex-col w-full">
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
