import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "@/svgs/menu.svg";
import { MenuState } from "@/store/types";
import useUserStore from "@/store/userStore";

const getTitle = (pathname: string) => {
  if (pathname === "/") {
    return "dashboard";
  } else if (pathname === "/settings") {
    return "settings";
  } else if (pathname === "/apps") {
    return "apps";
  } else if (pathname === "/integrations/owncast") {
    return "owncast";
  } else {
    return "";
  }
};

export default function Navbar({
  menu,
  setMenuState,
  openLoginModal,
}: {
  menu: MenuState;
  setMenuState: (state: MenuState) => void;
  openLoginModal: () => void;
}) {
  const pathname = usePathname();
  const [title, setTitle] = useState("dashboard");
  const pubkey = useUserStore((state) => state.pubkey);

  useEffect(() => {
    setTitle(getTitle(pathname));
  }, [pathname]);

  return (
    <nav className="bg-stone-900 border-b border-black">
      <div className="flex px-3 py-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <button
            className={`${
              menu.hidden ? "hover:bg-stone-800" : "bg-stone-800"
            } rounded px-2 py-1`}
            onClick={() =>
              setMenuState({
                collapsed: menu.collapsed,
                hidden: !menu.hidden,
              })
            }
          >
            <Menu
              height={24}
              width={24}
              strokeWidth={1.5}
              className="stroke-white"
            />
          </button>
          <p className="text-lg capitalize">{title}</p>
        </div>
        <div>
          {!pubkey && (
            <button
              onClick={openLoginModal}
              className="py-1 px-2 rounded bg-red-500"
            >
              <p className="capitalize font-semibold">login</p>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
