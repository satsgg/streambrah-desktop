import { MenuState } from "@/store/types";
import ArrowDown from "@/svgs/arrowDown.svg";
import ArrowUp from "@/svgs/arrowUp.svg";

export default function MenuItem({
  name,
  layout,
  icon,
  expandable = false,
  expanded = false,
  onClick,
}: {
  name: string;
  layout: MenuState;
  icon: JSX.Element;
  expandable?: boolean;
  expanded?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={`${
        expandable ? "hover:cursor-pointer" : ""
      } flex justify-between px-4 py-2 mx-1 rounded hover:bg-gray-500`}
      onClick={onClick}
    >
      <div className="flex gap-2">
        {icon}
        <p
          className={`${
            layout === "collapsed" ? "hidden" : ""
          } capitalize select-none`}
        >
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
