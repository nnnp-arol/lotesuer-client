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
  quiniela: "inactive",
  bingo: "inactive",
  informes: "inactive",
};
type NavType = {
  setselectedScreen: (e: any) => void;
};

export const Nav: React.FC<NavType> = ({ setselectedScreen }) => {
  const [tabs, setTabs] = useState(initialValues);
  const [saleFeatures, setSaleFeatures] = useState({
    collapsed: false,
    selected: "quiniela",
  });

  const handleTabs = (e: any) => {
    setTabs({ ...initialValues, [e.currentTarget.id]: "active" });
    setselectedScreen(e.currentTarget.id);
  };

  useEffect(() => {
    setTabs({ ...initialValues, inicio: "activate" });
  }, []);
  return (
    <div className="flex items-start pt-10 bg-black flex-col w-1/6">
      <ul className="w-full mt-8 flex-col flex justify-center">
        <NavItem
          state={tabs.inicio}
          icon={<HomeOutlinedIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              id="inicio"
              to="/home"
              onClick={(e) => {
                setSaleFeatures({ ...saleFeatures, collapsed: false });

                handleTabs(e);
              }}
            >
              Inicio
            </Link>
          }
        />
        <NavItem
          state={tabs.vendedores}
          icon={<PersonOutlineIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              id="vendedores"
              to="/sellers"
              onClick={(e) => {
                setSaleFeatures({ ...saleFeatures, collapsed: false });
                handleTabs(e);
              }}
            >
              Vendedores
            </Link>
          }
        />
        <NavItem
          state={tabs.ventas}
          icon={<PointOfSaleIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              to="/quiniela"
              style={{
                color: saleFeatures.collapsed ? "#f8fafc" : "#9ca3af",
                cursor: "pointer",
              }}
              id="quiniela"
              onClick={(e) => {
                setTabs({ ...initialValues, quiniela: "active" });
                setSaleFeatures({
                  ...saleFeatures,
                  collapsed: !saleFeatures.collapsed,
                });
              }}
            >
              Ventas
            </Link>
          }
        />
        {saleFeatures.collapsed ? (
          <>
            <li
              className="my-4 text-left text-lg flex justify-center"
              style={{
                color:
                  saleFeatures.selected === "quiniela" ? "#f8fafc" : "#9ca3af",
              }}
            >
              <Link
                to="/quiniela"
                id="quiniela"
                onClick={(e) => {
                  setSaleFeatures({ ...saleFeatures, selected: "quiniela" });
                  handleTabs(e);
                }}
              >
                - Quiniela
              </Link>
            </li>
            <li
              className="my-4 text-left text-lg flex justify-center"
              style={{
                color:
                  saleFeatures.selected === "bingos" ? "#f8fafc" : "#9ca3af",
              }}
            >
              <Link
                to="/bingos"
                id="bingos"
                onClick={(e) => {
                  setSaleFeatures({ ...saleFeatures, selected: "bingos" });
                  handleTabs(e);
                }}
              >
                - Bingos
              </Link>
            </li>
            <div className="w-1/2 h-px bg-white ml-10 opacity-30"></div>
          </>
        ) : null}
        <NavItem
          division={false}
          state={tabs.informes}
          icon={
            <TextSnippetOutlinedIcon color="inherit" className={styles.icons} />
          }
          link={
            <Link
              id="informes"
              to="/reports"
              onClick={(e) => {
                setSaleFeatures({ ...saleFeatures, collapsed: false });
                handleTabs(e);
              }}
            >
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
  ventasActive: "cursor-pointer text-white",
};
