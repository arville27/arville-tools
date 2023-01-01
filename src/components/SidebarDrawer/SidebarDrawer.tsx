import Link from "next/link";
import { HomeIcon, MusicalNoteIcon } from "@heroicons/react/24/outline";
import SidebarItem from "./SidebarItem";
import { motion } from "framer-motion";
import useDrawerStateStore from "./useDrawerStateStore";
import SidebarPortableDrawerBtn from "./SidebarPortableDrawerBtn";

type Props = {
  sidebarContent: { href: string; title: string; icon: JSX.Element }[];
};

const SidebarDrawer: React.FC<Props> = ({ sidebarContent }) => {
  const isOpen = useDrawerStateStore((state) => state.isOpen);
  const toggleDrawer = useDrawerStateStore((state) => state.toggleDrawer);

  return (
    <>
      <motion.aside
        initial="close"
        animate={isOpen ? "open" : "close"}
        variants={{ open: { x: "0" }, close: { x: "-100%" } }}
        transition={{ duration: 0.4 }}
        className="fixed z-50 flex h-screen w-screen"
        aria-label="Sidebar"
      >
        <div className="w-64 overflow-y-auto overflow-x-hidden bg-base-100 py-4 px-3 text-base-content md:w-80">
          <div className="mb-5 flex items-center justify-between pl-2.5">
            <Link
              href="/"
              className="self-center whitespace-nowrap text-xl font-semibold"
            >
              Arville Tools
            </Link>
            <SidebarPortableDrawerBtn />
          </div>
          <ul className="space-y-2">
            {sidebarContent.map((props, i) => (
              <button className="w-full" onClick={toggleDrawer} key={i}>
                <SidebarItem {...props} />
              </button>
            ))}
          </ul>
        </div>
        <div onClick={toggleDrawer} className="grow"></div>
      </motion.aside>
      {isOpen && (
        <div className="fixed z-40 h-screen w-screen bg-neutral/40"></div>
      )}
    </>
  );
};

export default SidebarDrawer;
