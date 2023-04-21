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
  enabled: boolean;
};

export const Nav: React.FC<NavType> = ({ setselectedScreen, enabled }) => {
  const [tabs, setTabs] = useState(initialValues);
  const [onlyIcon, setOnlyIcon] = useState(false);
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
    <div className="flex justify-start  bg-slate-900 flex-col w-1/6">
      <ul className="w-full flex-col flex justify-center">
        <NavItem
          state={tabs.inicio}
          // icon={<HomeOutlinedIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              id="inicio"
              to={enabled ? "/home" : "/"}
              onClick={(e) => {
                if (!enabled) {
                  return;
                }
                handleTabs(e);
              }}
            >
              <HomeOutlinedIcon color="inherit" className={styles.icons} />
              {!onlyIcon && "Inicio"}
            </Link>
          }
        />
        <NavItem
          state={tabs.vendedores}
          // icon={<PersonOutlineIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              id="vendedores"
              to={enabled ? "/sellers" : "/"}
              onClick={(e) => {
                if (!enabled) return;
                handleTabs(e);
              }}
            >
              <PersonOutlineIcon color="inherit" className={styles.icons} />
              {!onlyIcon && "Vendedores"}
            </Link>
          }
        />
        <NavItem
          state={tabs.ventas}
          // icon={<PointOfSaleIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              to={enabled ? "/quiniela" : "/"}
              style={{
                color: saleFeatures.collapsed ? "#f8fafc" : "#9ca3af",
                cursor: "pointer",
              }}
              id="quiniela"
              onClick={(e) => {
                if (!enabled) return;
                setTabs({ ...initialValues, quiniela: "active" });
                setSaleFeatures({
                  ...saleFeatures,
                  collapsed: !saleFeatures.collapsed,
                });
              }}
            >
              <PointOfSaleIcon color="inherit" className={styles.icons} />
              {!onlyIcon && "Ventas"}
            </Link>
          }
        />
        <li
          className="my-4 text-left text-lg flex justify-center"
          style={{
            color: saleFeatures.selected === "quiniela" ? "#f8fafc" : "#9ca3af",
          }}
        >
          <Link
            to={enabled ? "/quiniela" : "/"}
            id="quiniela"
            onClick={(e) => {
              if (!enabled) return;
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
            color: saleFeatures.selected === "bingos" ? "#f8fafc" : "#9ca3af",
          }}
        >
          <Link
            to={!!enabled ? "/bingos" : "/"}
            id="bingos"
            onClick={(e) => {
              if (!enabled) return;
              setSaleFeatures({ ...saleFeatures, selected: "bingos" });
              handleTabs(e);
            }}
          >
            - Bingos
          </Link>
        </li>
        <div className="w-1/2 h-px bg-white ml-10 opacity-30"></div>
        <NavItem
          division={false}
          state={tabs.informes}
          // icon={<TextSnippetOutlinedIcon color="inherit" className={styles.icons} />}
          link={
            <Link
              id="informes"
              to={!!enabled ? "/reports" : "/"}
              onClick={(e) => {
                if (!enabled) return;
                handleTabs(e);
              }}
            >
              <TextSnippetOutlinedIcon
                color="inherit"
                className={styles.icons}
              />
              {!onlyIcon && "Informes"}
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
