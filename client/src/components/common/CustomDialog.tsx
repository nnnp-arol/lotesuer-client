import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

type CustomDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  title: string;
  text: string;
  onConfirm: () => void;
  onCancel: () => void;
  tref: any;
};

export const CustomDialog: (props: CustomDialogPropsType) => JSX.Element = ({
  open,
  handleClose,
  title,
  text,
  onConfirm,
  onCancel,
  tref,
}) => {
  return (
    <Dialog
      open={open}
      // TransitionComponent={Transition}
      // keepMounted
      onClose={handleClose}
      sx={{
        "& .MuiPaper-root": { backgroundColor: "grey" },
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {text ? <DialogContentText>{text}</DialogContentText> : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onConfirm} variant="contained" ref={tref}>
          Aceptar
        </Button>
        <Button onClick={onCancel} variant="contained">
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
