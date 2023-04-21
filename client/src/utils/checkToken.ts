import { useSnackbar } from "notistack";
import { trpc } from "./trpc";
import { useNavigate } from "react-router-dom";

export const checkToken = (token: string) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  trpc.token.verifyToken.useMutation().mutate(
    { token },
    {
      onSuccess: () => {},
      onError: () => {
        enqueueSnackbar("Token vencido", {
          variant: "error",
        });
        //   localStorage.removeItem('token')
        navigate("/");
      },
    }
  );
};
