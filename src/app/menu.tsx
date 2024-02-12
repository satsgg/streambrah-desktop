import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MenuState } from "@/store/types";
import OpenLeft from "@/svgs/openLeft.svg";
import OpenRight from "@/svgs/openRight.svg";
import Home from "@/svgs/home.svg";
import Settings from "@/svgs/settings.svg";
import VideoCamera from "@/svgs/videoCamera.svg";
import Wrench from "@/svgs/wrench.svg";
import Link from "next/link";
import MenuItem from "./menuItem";

export default function Menu({
  layout,
  setLayout,
  autoCollapseMenu,
}: {
  layout: MenuState;
  setLayout: (state: MenuState) => void;
  autoCollapseMenu: boolean;
}) {
  const pathName = usePathname();

  const [expandedItems, setExpandedItems] = useState({
    integrations: false,
  });

  const fLayout = autoCollapseMenu ? "collapsed" : layout;

  return (
    <div
      className={`${
        fLayout === "collapsed" ? "w-16" : "min-w-64"
      } flex flex-col`}
    >
      {!autoCollapseMenu && (
        <div
          className={`flex ${
            fLayout === "expanded" ? "justify-between" : "justify-center"
          } px-4 py-2`}
        >
          {fLayout === "expanded" && (
            <p className="text-sm font-semibold uppercase">Menu</p>
          )}
          <button
            onClick={() =>
              setLayout(fLayout === "expanded" ? "collapsed" : "expanded")
            }
          >
            {fLayout === "expanded" && (
              <OpenLeft
                width={24}
                height={24}
                strokeWidth={2}
                className="stroke-white"
              />
            )}
            {fLayout === "collapsed" && (
              <OpenRight
                width={24}
                height={24}
                strokeWidth={2}
                className="stroke-white"
              />
            )}
          </button>
        </div>
      )}

      <Link href="/">
        <MenuItem
          name="dashboard"
          layout={fLayout}
          highlighted={pathName == "/"}
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
          layout={fLayout}
          highlighted={pathName == "/settings"}
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
          layout={fLayout}
          highlighted={pathName == "/apps"}
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
        layout={fLayout}
        highlighted={
          (!expandedItems.integrations || fLayout === "collapsed") &&
          pathName.includes("/integrations")
        }
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
      <div
        className={`${
          expandedItems.integrations ? "max-h-20" : "invisible max-h-0"
        } transition-all linear`}
      >
        <Link href="/integrations/owncast">
          <div
            className={`
            ${fLayout === "collapsed" ? "hidden" : ""}
            ${expandedItems.integrations ? "" : "hidden"} ${
              pathName === "/integrations/owncast"
                ? "bg-red-500"
                : "hover:bg-stone-800"
            } flex pl-12 pr-4 py-2 mx-1 rounded`}
          >
            <p className="capitalize">owncast</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
