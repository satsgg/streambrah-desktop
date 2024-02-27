"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import useLayoutStore from "@/store/layoutStore";
import Navbar from "./navbar";
import { useEffect, useState } from "react";
import useMediaQuery from "./useMediaQuery";
import useUserStore from "@/store/userStore";
// import useNostrStore from "@/store/nostrStore";
import Menu from "./menu";
import { InteractionModal } from "./interactionModal";
import Login from "./login";
// import useObs from "./useObs";
import ConnectObs from "./connectObs";
import useObsStore from "@/store/obsStore";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [modal, setModal] = useState<"none" | "login" | "obsConnect">("none");
  const { menu, setMenuState } = useLayoutStore();
  const pubkey = useUserStore((state) => state.auth.pubkey);
  // const pubkey = useUserStore("", (state: { pubkey: any; }) => state.pubkey);
  const autoCollapseMenu = useMediaQuery("(max-width: 1024px)");
  const obsConnected = useObsStore((state) => state.connected);

  useEffect(() => {
    if (pubkey) {
      console.debug("yes pubkey", pubkey);
      useUserStore.persist.setOptions({
        name: pubkey,
      });
      useUserStore.persist.rehydrate();
      // localStorage.removeItem("defaultUser");
    } else {
      console.debug("no pubkey", pubkey);
      useUserStore.persist.setOptions({
        name: "defaultUser",
      });
    }
  }, [pubkey]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-full">
          <Navbar
            menu={menu}
            setMenuState={setMenuState}
            openLoginModal={() => setModal("login")}
            openObsConnectModal={() => setModal("obsConnect")}
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
                  <Login
                    close={() => setModal(obsConnected ? "none" : "obsConnect")}
                  />
                </InteractionModal>
              ),
              obsConnect: (
                <InteractionModal
                  title={"Connect OBS"}
                  close={() => setModal("none")}
                >
                  <ConnectObs close={() => setModal("none")} />
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
