import { useState } from "react";
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

  const collapse = autoCollapseMenu || layout.collapsed;

  return (
    <div
      className={`${layout.hidden ? "hidden" : ""} ${
        collapse ? "w-16" : "min-w-64"
      } flex flex-col`}
    >
      {!autoCollapseMenu && (
        <div
          className={`flex ${
            collapse ? "justify-center" : "justify-between"
          } px-4 py-2`}
        >
          {!collapse && <p className="text-sm font-semibold uppercase">Menu</p>}
          <button
            onClick={() =>
              setLayout({
                collapsed: !layout.collapsed,
                hidden: layout.hidden,
              })
            }
          >
            {!collapse && (
              <OpenLeft
                width={24}
                height={24}
                strokeWidth={2}
                className="stroke-white"
              />
            )}
            {collapse && (
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
          collapse={collapse}
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
          collapse={collapse}
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
          name="apps"
          collapse={collapse}
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
        collapse={collapse}
        highlighted={
          (!expandedItems.integrations || collapse) &&
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
            ${collapse ? "hidden" : ""}
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
