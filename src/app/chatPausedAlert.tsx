import { useState } from "react";

export default function ChatPausedAlert({
  onClick: handleClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const label = isHovered ? (
    <span className="inline-flex items-center">See new messages</span>
  ) : (
    <span className="inline-flex items-center">Chat paused due to scroll</span>
  );

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      className={`w-64 inline-flex justify-center px-4 py-2 rounded-lg bg-black/80 cursor-pointer ${className}`}
    >
      {label}
    </div>
  );
}
