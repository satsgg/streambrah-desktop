"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import useLayoutStore from "@/store/layoutStore";
import Navbar from "./navbar";
import Menu from "./menu";
import useMediaQuery from "./useMediaQuery";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { menu, setMenuState } = useLayoutStore();
  const autoCollapseMenu = useMediaQuery("(max-width: 1024px)");

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-full">
          <Navbar menu={menu} setMenuState={setMenuState} />
          <div className="flex h-full">
            <Menu
              layout={menu}
              setLayout={setMenuState}
              autoCollapseMenu={autoCollapseMenu}
            />
            <main className="w-full">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
