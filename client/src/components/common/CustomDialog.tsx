import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useEffect, useRef } from "react";

type CustomDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  title: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  bodyContent?: JSX.Element;
  pressEnter?: boolean;
  setPressEnter?: (value: boolean) => void;
};

export const CustomDialog: (props: CustomDialogPropsType) => JSX.Element = ({
  open,
  handleClose,
  title,
  onConfirm = () => null,
  onCancel,
  bodyContent,
  pressEnter,
  setPressEnter,
}) => {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (!!pressEnter && !!setPressEnter) {
      onConfirm();
      setPressEnter(false);
    }
  }, [pressEnter]);

  return (
    <Dialog
      open={open}
      // TransitionComponent={Transition}
      // keepMounted
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": { backgroundColor: "#1e293b" },
      }}
    >
      <div className="px-5 pt-2">
        <DialogTitle className="text-center text-white">{title}</DialogTitle>
        {bodyContent && (
          <DialogContent className="w-80 flex flex-col justify-center items-center flex-1">
            {bodyContent}
          </DialogContent>
        )}
        <DialogActions className="">
          <div className="flex flex-row flex-1 gap-4 px-5 py-5 justify-between">
            <Button onClick={onConfirm} variant="contained" ref={confirmRef}>
              Aceptar
            </Button>
            <Button onClick={onCancel} variant="contained">
              Cancelar
            </Button>
          </div>
        </DialogActions>
      </div>
    </Dialog>
  );
};
