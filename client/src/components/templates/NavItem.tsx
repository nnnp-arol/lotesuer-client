import { Link, LinkProps } from "react-router-dom";
import React, { ReactElement, ReactNode } from "react";
import { motion } from "framer-motion";

const variants = {
  active: {
    color: "#f8fafc",
    transition: { duration: 0.5 },
    scale: 1.2,
  },
  inactive: {
    color: "#9ca3af",
    transition: { duration: 0.5 },
  },
};

type NavItemType = {
  icon: ReactNode;
  link: ReactElement;
  state: string;
  division?: boolean;
};
export const NavItem: React.FC<NavItemType> = ({
  icon,
  link,
  state,
  division = true,
}) => {
  return (
    <>
      <li className="my-5 text-left pl-10 text-lg flex">
        <motion.div
          variants={variants}
          animate={state}
          whileHover={{ opacity: 0.7 }}
        >
          {icon}
          {link}
        </motion.div>
      </li>
      {division && <div className="w-1/2 h-px bg-white ml-10 opacity-30"></div>}
    </>
  );
};
