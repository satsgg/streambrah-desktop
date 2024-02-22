"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Menu from "@/svgs/menu.svg";
import { MenuState } from "@/store/types";
import useUserStore from "@/store/userStore";
import useObsStore from "@/store/obsStore";
import Link from "next/link";
import Account from "@/svgs/account.svg";
import LogOut from "@/svgs/logOut.svg";
import { invoke } from "@tauri-apps/api";

const getTitle = (pathname: string) => {
  if (pathname === "/") {
    return "dashboard";
  } else if (pathname === "/settings/keys") {
    return "keys";
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
  openObsConnectModal,
}: {
  menu: MenuState;
  setMenuState: (state: MenuState) => void;
  openLoginModal: () => void;
  openObsConnectModal: () => void;
}) {
  const pathname = usePathname();
  const [title, setTitle] = useState("dashboard");
  const [pubkey, logout, hydrated] = useUserStore((state) => [
    state.pubkey,
    state.logout,
    state.hydrated,
  ]);
  const obsConnected = useObsStore((state) => state.connected);
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const deleteKeyPair = async (publicKey: string) => {
    console.debug("deleting private key");
    try {
      const res = await invoke("delete_key_pair", {
        publicKey: publicKey,
      });
      console.debug("res", res);
    } catch (e: any) {
      console.error("failed to delete key pair", e);
    }
  };

  const handleLogout = async () => {
    await deleteKeyPair(pubkey);
    setShowAccountMenu(false);
    logout();
  };

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
          <div className="flex items-center gap-2">
            <button onClick={openObsConnectModal}>
              {obsConnected ? (
                <div className="flex items-center gap-1">
                  <div className="bg-green-500 rounded-[50%] h-3 w-3" />
                  <p className="text-sm font-semibold">OBS</p>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <div className="bg-red-500 rounded-[50%] h-3 w-3" />
                  <p className="text-sm font-semibold">OBS</p>
                </div>
              )}
            </button>
            {hydrated && pubkey && (
              <div className="dropdown relative">
                <a
                  className="dropdown-toggle hidden-arrow flex items-center"
                  id="dropdownAccountButton"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  onClick={() =>
                    setShowAccountMenu((showAccountMenu) => !showAccountMenu)
                  }
                >
                  <Account width={32} height={32} />
                </a>
                {showAccountMenu && (
                  <ul
                    className={
                      "absolute left-auto right-0 z-50 float-left m-0 mt-1 w-56 min-w-max list-none rounded-lg border-none bg-stone-900 bg-clip-padding py-2 px-2 text-left text-base shadow-lg"
                    }
                    aria-labelledby="dropdownAccountButton"
                    id="dropdown-menu"
                  >
                    <li>
                      <Link href="/">
                        <div
                          className="inline-flex w-full whitespace-nowrap rounded bg-transparent py-1 px-1 text-sm font-normal text-white hover:bg-stone-700"
                          onClick={handleLogout}
                        >
                          <LogOut
                            width={20}
                            height={20}
                            className="mr-1"
                            strokeWidth={1.5}
                          />
                          <span className="select-none">Log Out</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )}
            {hydrated && !pubkey && (
              <button
                onClick={openLoginModal}
                className="py-1 px-2 rounded bg-red-500"
              >
                <p className="capitalize font-semibold">login</p>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
