import React, { ReactNode, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { Nav } from "./Nav";
import { AppTemplateType } from "../../models/types";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { CustomDialog } from "../common/CustomDialog";
import { useUserStore } from "../../store/user";
import { shallow } from "zustand/shallow";
import { useNavigate } from "react-router-dom";

export const AppTemplate: React.FC<AppTemplateType> = ({ children }) => {
  const [selectedScreen, setselectedScreen] = useState<string>("");
  const [dropMenu, setDropMenu] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  const { setToken, setUser, user, token } = useUserStore();
  const navigate = useNavigate();

  // useEffect(() => {
  //   console.log(selectedScreen);
  // }, [selectedScreen]);

  const RenderIcon = () => {
    if (!token) {
      return <></>;
    }

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
    if (selectedScreen === "quiniela") {
      return <PointOfSaleIcon color="inherit" className={classname} />;
    }
    if (selectedScreen === "bingos") {
      return <PointOfSaleIcon color="inherit" className={classname} />;
    }
    if (selectedScreen === "informes") {
      return <TextSnippetOutlinedIcon color="inherit" className={classname} />;
    }
    return <></>;
  };

  const RenderScreenTitle: React.FC = () => {
    if (!token) {
      return <></>;
    }
    const controls = useAnimationControls();

    useEffect(() => {
      controls.start({
        x: -0,
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
        {selectedScreen === "quiniela" || selectedScreen === "bingos" ? (
          <div className="flex flex-row justify-center items-center">
            <h1 className="text-3xl text-white">Ventas</h1>
            <h1 className="text-3xl text-white mx-5">/</h1>
            <h1 className="text-2xl text-slate-500">{selectedScreen}</h1>
          </div>
        ) : (
          <h1 className="text-3xl text-white">{selectedScreen} </h1>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col overflow-hidden h-screen bg-black ">
      <div className="w-full flex flex-row py-5 px-10 items-center border-b border-white border-opacity-30">
        <div className="flex justify-center items-center flex-col pl-10">
          <img src="images/lotesuer.png" className="rounded-full w-16 h-16" />
          <h1 className="text-md mt-2">Lotesuer</h1>
        </div>
        <RenderScreenTitle />
        <div className="relative">
          {!!user ? (
            <button onClick={() => setDropMenu(!dropMenu)}>
              <img
                src="images/admin.png"
                className="rounded-full w-20 h-20  border-gray-400"
              />
            </button>
          ) : null}
          <Menu
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={dropMenu}
            onClose={() => setDropMenu(false)}
            sx={{
              position: "absolute",
              top: 88,
              "& .MuiPaper-root": {
                backgroundColor: "#020617",
                color: "white",
              },
            }}
          >
            <MenuItem className="bg-slate-800">Profile</MenuItem>
            <MenuItem className="bg-slate-800">My account</MenuItem>
            <MenuItem
              onClick={() => setShowDialog(true)}
              className="bg-slate-800"
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="flex flex-row overflow-hidden flex-1 bg-slate-900">
        <Nav setselectedScreen={setselectedScreen} enabled={!!token} />

        <div className="flex-1">{children}</div>
      </div>
      <CustomDialog
        bodyContent={<></>}
        open={showDialog}
        handleClose={() => setShowDialog(false)}
        title="Estas seguro de cerrar sesion?"
        onCancel={() => {
          setShowDialog(false);
        }}
        onConfirm={() => {
          setShowDialog(false);
          setDropMenu(false);
          setToken("");
          setUser("");
          localStorage.removeItem("token");
          navigate("/");
        }}
      />
    </div>
  );
};
