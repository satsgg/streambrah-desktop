import ArrowDown from "@/svgs/arrowDown.svg";
import ArrowUp from "@/svgs/arrowUp.svg";

export default function MenuItem({
  name,
  collapse,
  icon,
  highlighted = false,
  expandable = false,
  expanded = false,
  onClick,
}: {
  name: string;
  collapse: boolean;
  icon: JSX.Element;
  highlighted?: boolean;
  expandable?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`${expandable ? "hover:cursor-pointer" : ""} ${
        highlighted ? "bg-primary-500" : "hover:bg-stone-800"
      } flex justify-between px-4 py-2 mx-1 rounded`}
      onClick={onClick}
    >
      <div className="flex gap-2">
        {icon}
        <p className={`${collapse ? "hidden" : ""} capitalize select-none`}>
          {name}
        </p>
      </div>
      {expandable && expanded && (
        <ArrowUp
          width={24}
          height={24}
          strokeWidth={2.0}
          className="stroke-white"
        />
      )}
      {expandable && !expanded && (
        <ArrowDown
          width={24}
          height={24}
          strokeWidth={2.0}
          className="stroke-white"
        />
      )}
    </div>
  );
}
