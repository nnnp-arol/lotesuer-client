import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { NavItem } from "./NavItem";
import { Link } from "react-router-dom";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";

const initialValues = {
  inicio: "inactive",
  vendedores: "inactive",
  ventas: "inactive",
  informes: "inactive",
};
type NavType = {
  setselectedScreen: (e: any) => void;
};

export const Nav: React.FC<NavType> = ({ setselectedScreen }) => {
  const [tabs, setTabs] = useState(initialValues);

  const handleTabs = (e: any) => {
    setTabs({ ...initialValues, [e.currentTarget.id]: "active" });
    setselectedScreen(e.currentTarget.id);
  };

  useEffect(() => {
    setTabs({ ...initialValues, inicio: "activate" });
  }, []);
  return (
    <div className="flex items-start pt-10 bg-black flex-col w-1/6">
      <ul className="w-full mt-8">
        <NavItem
          state={tabs.inicio}
          icon={<HomeOutlinedIcon color="inherit" className={styles.icons} />}
          link={
            <Link id="inicio" to="/home" onClick={(e) => handleTabs(e)}>
              Inicio
            </Link>
          }
        />
        <NavItem
          state={tabs.vendedores}
          icon={<PersonOutlineIcon color="inherit" className={styles.icons} />}
          link={
            <Link id="vendedores" to="/sellers" onClick={(e) => handleTabs(e)}>
              Vendedores
            </Link>
          }
        />
        <NavItem
          state={tabs.ventas}
          icon={<PointOfSaleIcon color="inherit" className={styles.icons} />}
          link={
            <Link id="ventas" to="/sales" onClick={(e) => handleTabs(e)}>
              Ventas
            </Link>
          }
        />
        <NavItem
          division={false}
          state={tabs.informes}
          icon={
            <TextSnippetOutlinedIcon color="inherit" className={styles.icons} />
          }
          link={
            <Link id="informes" to="/reports" onClick={(e) => handleTabs(e)}>
              Informes
            </Link>
          }
        />
      </ul>
    </div>
  );
};

const styles = {
  icons: "mr-3",
};
