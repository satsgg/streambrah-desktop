import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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

export default function Navbar() {
  const pathname = usePathname();
  const [title, setTitle] = useState("dashboard");

  useEffect(() => {
    setTitle(getTitle(pathname));
  }, [pathname]);

  return (
    <nav className="">
      <div className="flex px-4 py-2 justify-between">
        <div>
          <p className="text-lg capitalize">{title}</p>
        </div>
        <div>
          <p>Right</p>
        </div>
      </div>
    </nav>
  );
}
