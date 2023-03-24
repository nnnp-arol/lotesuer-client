import React, { useEffect, useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export const Loader = ({ state }) => {
    const [open, setOpen] = useState(false)
    useEffect(()=> {
        if(state){
            setOpen(true)
        }
    },[state])
  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
      
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
