import { useState } from "react";
import { trpc } from "../utils/trpc";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useUserStore } from "../store/user";
import { useNavigate } from "react-router-dom";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";

export const LoginScreen: (props: { setToken: any }) => JSX.Element = ({
  setToken,
}) => {
  const navigate = useNavigate();
  const [createMode, setCreateMode] = useState(false);
  const store = useUserStore();
  const createUser = trpc.user.createUser.useMutation();
  const createLogin = trpc.user.login.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    if (createMode) {
      return createUser.mutate(
        { user_name: data.userName, password: data.password },
        {
          onSuccess: (data) => {
            store.setToken(data.token);
            store.setUser(data.user);
            setToken(data.token);
            localStorage.setItem("token", data.token);
            navigate("/home");
          },
        }
      );
    }
    createLogin.mutate(
      { user_name: data.userName, password: data.password },
      {
        onSuccess: (data) => {
          store.setToken(data.token);
          store.setUser(data.user);
          setToken(data.token);
          localStorage.setItem("token", data.token);
          navigate("/home");
        },
      }
    );
  });
  if (createLogin.status === "loading") {
    return <></>;
  }

  return (
    <div className="h-full flex overflow-hidden px-2 justify-center ">
      <div className="p-5 w-1/2 flex items-center justify-center">
        <div className="w-3/4 flex flex-col gap-5 mt-10 h-3/4 py-5 px-10 bg-slate-700 rounded-xl">
          <div className="flex gap-5 justify-between items-start">
            <button
              className={`${
                !createMode
                  ? "border-b-2 border-slate-300 text-slate-300"
                  : "text-slate-500"
              } gap-1 flex flex-row pb-2`}
              onClick={() => {
                setCreateMode(!createMode);
              }}
            >
              <LoginIcon />
              iniciar sesion
            </button>
            <button
              className={`${
                !!createMode
                  ? "border-b-2 border-slate-300 text-slate-300"
                  : "text-slate-500"
              } gap-1 flex flex-row pb-2`}
              onClick={() => {
                setCreateMode(!createMode);
              }}
            >
              <PersonAddIcon />
              crear cuenta
            </button>
          </div>
          <form onSubmit={onSubmit}>
            <div className="mt-10">
              <h1 className="text-center text-4xl">
                {createMode ? "crear cuenta" : "iniciar sesion"}
              </h1>
            </div>
            <div className="w-full flex flex-col justify-between  mt-10 gap-2">
              <p>nombre de usuario</p>
              <input
                type="text"
                className={`text-black ${
                  errors.userName && "outline-2 outline-red-600  "
                }`}
                {...register("userName", { required: true })}
              />
              {errors.userName && (
                <span className="text-red-600 text-xs">
                  Este campo es requerido
                </span>
              )}
            </div>
            <div className="w-full flex flex-col justify-between gap-2 mt-5 ">
              <p>password</p>
              <input
                type="password"
                className={`text-black ${
                  errors.password && "outline-2 outline-red-600 "
                }`}
                {...register("password", { required: true })}
              />
              {errors.password && (
                <span className="text-red-600 text-xs">
                  Este campo es requerido
                </span>
              )}
            </div>
            <div className=" mt-10 flex justify-center items-center">
              <Button variant="contained" fullWidth onClick={onSubmit}>
                {createMode ? "Registrar" : "Iniciar Sesion"}
              </Button>
            </div>
            <div className=" mt-5 flex justify-center items-center">
              <Button
                onClick={() => {
                  // localStorage.setItem("token", "qwqwddqwqdw");
                  setToken("asdasdasd");
                }}
              >
                Cerrar sesion
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
