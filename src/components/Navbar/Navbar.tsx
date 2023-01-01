import Link from "next/link";
import React from "react";
import SidebarPortableDrawerBtn from "../SidebarDrawer/SidebarPortableDrawerBtn";
import ThemeSwitcherButton from "./ThemeSwitcherButton";

type Props = {};

const Navbar: React.FC<Props> = () => {
  return (
    <div className="container navbar mx-auto justify-between py-7">
      <div className="space-x-4">
        <Link
          href="/"
          className="btn btn-ghost px-4 py-2 text-lg normal-case tracking-wider"
        >
          arville tools
        </Link>
        <SidebarPortableDrawerBtn />
      </div>
      <ThemeSwitcherButton />
    </div>
  );
};

export default Navbar;
