import React, { ReactNode, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Nav } from "./Nav";
import { AppTemplateType, RenderScreenTitleType } from "../../models/types";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

export const AppTemplate: React.FC<AppTemplateType> = ({ children }) => {
  const [selectedScreen, setselectedScreen] = useState<string>("home");

  const RenderIcon = () => {
    const classname = "scale-x-110 scale-y-110";
    if (selectedScreen === "inicio") {
      return <HomeOutlinedIcon color="inherit" className={classname} />;
    }
    if (selectedScreen === "vendedores") {
      return <PersonOutlineIcon color="inherit" className={classname} />;
    }
    if (selectedScreen === "ventas") {
      return <PointOfSaleIcon color="inherit" className={classname} />;
    }
  };

  const RenderScreenTitle: React.FC = () => {
    const controls = useAnimationControls();

    useEffect(() => {
      controls.start({
        x: -450,
        transition: { duration: 0.5 },
      });
    }, []);

    return (
      <motion.div
        initial={{ x: -500 }}
        animate={controls}
        className="flex flex-row items-center gap-6 justify-center flex-1"
      >
        {RenderIcon()}
        <h1 className="text-3xl text-white">{selectedScreen}</h1>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden h-screen bg-slate-900">
      <div className="w-full flex flex-row py-8 px-10">
        <div className="px-5 rounded-full bg-red-600 border-l-neutral-400 border-b-neutral-500">
          <h1 className="text-3xl text-white">Lotesuer</h1>
        </div>
        <RenderScreenTitle />
      </div>
      <div className="bg-slate-600 flex flex-row overflow-hidden flex-1">
        <Nav setselectedScreen={setselectedScreen} />

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};
