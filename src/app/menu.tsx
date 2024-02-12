import { useState } from "react";
import { MenuState } from "@/store/types";
import OpenLeft from "@/svgs/openLeft.svg";
import OpenRight from "@/svgs/openRight.svg";
import Home from "@/svgs/home.svg";
import Settings from "@/svgs/settings.svg";
import VideoCamera from "@/svgs/videoCamera.svg";
import Wrench from "@/svgs/wrench.svg";
import ArrowDown from "@/svgs/arrowDown.svg";
import Link from "next/link";
import MenuItem from "./menuItem";

export default function Menu({
  layout,
  setLayout,
}: {
  layout: MenuState;
  setLayout: (state: MenuState) => void;
}) {
  const [expandedItems, setExpandedItems] = useState({
    integrations: false,
  });
  return (
    <div
      className={`${layout === "collapsed" ? "w-16" : "w-1/6"} flex flex-col`}
    >
      <div className="flex justify-between px-4 py-2">
        {layout === "expanded" && (
          <p className="text-sm font-semibold uppercase">Menu</p>
        )}
        <button
          onClick={() =>
            setLayout(layout === "expanded" ? "collapsed" : "expanded")
          }
        >
          {layout === "expanded" && (
            <OpenLeft
              width={24}
              height={24}
              strokeWidth={2}
              className="stroke-white"
            />
          )}
          {layout === "collapsed" && (
            <OpenRight
              width={24}
              height={24}
              strokeWidth={2}
              className="stroke-white"
            />
          )}
        </button>
      </div>
      <Link href="/">
        <MenuItem
          name="dashboard"
          layout={layout}
          icon={
            <Home
              width={24}
              height={24}
              strokeWidth={1.5}
              className="stroke-white"
            />
          }
        />
      </Link>

      <Link href="/settings">
        <MenuItem
          name="settings"
          layout={layout}
          icon={
            <Settings
              width={24}
              height={24}
              strokeWidth={1.5}
              className="stroke-white"
            />
          }
        />
      </Link>

      <Link href="/apps">
        <MenuItem
          name="streaming apps"
          layout={layout}
          icon={
            <VideoCamera
              width={24}
              height={24}
              strokeWidth={1.5}
              className="stroke-white"
            />
          }
        />
      </Link>

      <MenuItem
        name="integrations"
        layout={layout}
        icon={
          <Wrench
            width={24}
            height={24}
            strokeWidth={1.2}
            className="stroke-white"
          />
        }
        expandable
        expanded={expandedItems.integrations}
        onClick={() =>
          setExpandedItems((prev) => {
            return {
              ...prev,
              integrations: !prev.integrations,
            };
          })
        }
      />

      {expandedItems.integrations && (
        <Link href="/integrations/owncast">
          <div className="flex pl-12 pr-4 py-2 mx-1 rounded hover:bg-gray-500">
            <p className="capitalize">owncast</p>
          </div>
        </Link>
      )}
    </div>
  );
}
