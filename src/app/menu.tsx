import { MenuState } from "@/store/types";
import OpenLeft from "@/svgs/openLeft.svg";
import OpenRight from "@/svgs/openRight.svg";
import Home from "@/svgs/home.svg";
import Settings from "@/svgs/settings.svg";
import VideoCamera from "@/svgs/videoCamera.svg";
import Wrench from "@/svgs/wrench.svg";
import ArrowDown from "@/svgs/arrowDown.svg";

export default function Menu({
  layout,
  setLayout,
}: {
  layout: MenuState;
  setLayout: (state: MenuState) => void;
}) {
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
      <div className="flex justify-between px-4 py-2">
        <div className="flex gap-2">
          <Home
            width={24}
            height={24}
            strokeWidth={1.5}
            className="stroke-white"
          />
          <p className={`${layout === "collapsed" ? "hidden" : ""} capitalize`}>
            dashboard
          </p>
        </div>
      </div>
      <div className="flex justify-between px-4 py-2">
        <div className="flex gap-2">
          <Settings
            width={24}
            height={24}
            strokeWidth={1.5}
            className="stroke-white"
          />
          <p className={`${layout === "collapsed" ? "hidden" : ""} capitalize`}>
            settings
          </p>
        </div>
      </div>
      <div className="flex justify-between px-4 py-2">
        <div className="flex gap-2">
          <VideoCamera
            width={24}
            height={24}
            strokeWidth={1.5}
            className="stroke-white"
          />
          <p className={`${layout === "collapsed" ? "hidden" : ""} capitalize`}>
            streaming apps
          </p>
        </div>
      </div>
      <div className="flex justify-between px-4 py-2">
        <div className="flex gap-2">
          <Wrench
            width={24}
            height={24}
            strokeWidth={1.2}
            className="stroke-white"
          />
          <p className={`${layout === "collapsed" ? "hidden" : ""} capitalize`}>
            integrations
          </p>
        </div>
        <ArrowDown
          width={24}
          height={24}
          strokeWidth={2.0}
          className="stroke-white"
        />
      </div>
    </div>
  );
}
