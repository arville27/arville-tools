import React from "react";
import useDrawerStateStore from "./useDrawerStateStore";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

type Props = {};

const variants = {
  show: { opacity: 1, rotate: 0 },
  hide: { opacity: 0, rotate: -180 },
};

const SidebarPortableDrawerBtn: React.FC<Props> = () => {
  const isOpen = useDrawerStateStore((state) => state.isOpen);
  const toggleDrawer = useDrawerStateStore((state) => state.toggleDrawer);

  return (
    <button
      onClick={toggleDrawer}
      className="swap-rotate swap btn-ghost btn-circle"
    >
      <motion.div
        initial="hide"
        animate={isOpen ? "show" : "hide"}
        variants={variants}
        transition={{ duration: 0.15 }}
      >
        <XMarkIcon className="h-7 w-7" />
      </motion.div>
      <motion.div
        initial="show"
        animate={isOpen ? "hide" : "show"}
        variants={variants}
        transition={{ duration: 0.15 }}
      >
        <Bars3Icon className="h-7 w-7" />
      </motion.div>
    </button>
  );
};

export default SidebarPortableDrawerBtn;
