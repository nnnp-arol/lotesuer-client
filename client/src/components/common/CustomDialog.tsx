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
  onConfirm?: () => void;
  onCancel?: () => void;
  bodyContent: JSX.Element;
};

export const CustomDialog: (props: CustomDialogPropsType) => JSX.Element = ({
  open,
  handleClose,
  title,
  onConfirm,
  onCancel,
  bodyContent,
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
      <DialogTitle className="text-center">{title}</DialogTitle>
      <DialogContent className="w-80 flex flex-col justify-center items-center flex-1">
        {bodyContent}
      </DialogContent>
      <DialogActions className="">
        <div className="flex flex-col flex-1 gap-4 px-5">
          <Button onClick={onConfirm} variant="contained">
            Aceptar
          </Button>
          <Button onClick={onCancel} variant="contained">
            Cancelar
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
};
