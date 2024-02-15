"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import useLayoutStore from "@/store/layoutStore";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";
import useUserStore from "@/store/userStore";
import useNostrStore from "@/store/nostrStore";
import Menu from "./menu";
import { InteractionModal } from "./interactionModal";
import Login from "./login";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [modal, setModal] = useState<"none" | "login">("none");
  const { menu, setMenuState } = useLayoutStore();
  const pubkey = useUserStore((state) => state.pubkey);
  const autoCollapseMenu = useMediaQuery("(max-width: 1024px)");

  useEffect(() => {
    if (pubkey) {
      console.debug("yes pubkey", pubkey);
      // useNostrStore.persist.setOptions({ name: pubkey });
      useNostrStore.persist.setOptions({
        name: pubkey,
      });
      useNostrStore.persist.rehydrate();
    } else {
      // TODO: Log out
      console.debug("no pubkey", pubkey);
    }
    // useNostrStore.persist.setOptions({ name: pubkey });
  }, [pubkey]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-full">
          <Navbar
            menu={menu}
            setMenuState={setMenuState}
            openLoginModal={() => setModal("login")}
          />
          <div className="flex h-full">
            <Menu
              layout={menu}
              setLayout={setMenuState}
              autoCollapseMenu={autoCollapseMenu}
            />
            <main className="w-full">{children}</main>
          </div>
        </div>

        <div>
          {
            {
              login: (
                <InteractionModal
                  title={"Log In"}
                  close={() => setModal("none")}
                >
                  <Login close={() => setModal("none")} />
                </InteractionModal>
              ),
              none: null,
            }[modal]
          }
        </div>
      </body>
    </html>
  );
}
