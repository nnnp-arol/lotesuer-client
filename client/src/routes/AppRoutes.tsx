import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "../screens/Home";
import SalesScreen from "../screens/SalesScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import SellersScreen from "../screens/SellersScreen";
import { BingosScreen } from "../screens/BingosScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { trpc } from "../utils/trpc";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useUserStore } from "../store/user";

type AppRoutePropsType = {
  setToken: React.Dispatch<React.SetStateAction<string>>;
  token: string;
};

function AppRoutes({ setToken, token }: AppRoutePropsType): JSX.Element {
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const navigate = useNavigate();
  const localtoken = localStorage.getItem("token");
  const verifyToken = trpc.token.verifyToken.useMutation();
  const { enqueueSnackbar } = useSnackbar();
  const store = useUserStore();

  useEffect(() => {
    if (!!localtoken) {
      verifyToken.mutate(
        { token: localtoken && localtoken },
        {
          onSuccess: () => {},
          onError: () => {
            console.log(store.user);
            enqueueSnackbar("El token vencio", { variant: "error" });
            store.setToken("");
            store.setUser("");
            localStorage.removeItem("token");
            navigate("/");
          },
        }
      );
    }
    // return () => {};
  }, [selectedRoute]);

  return (
    <Routes>
      <Route path="/" element={<LoginScreen setToken={setToken} />} index />
      <Route
        path="/home"
        element={<Home setSelectedRoute={() => setSelectedRoute} />}
      />
      <Route
        path="/sellers"
        element={<SellersScreen setSelectedRoute={setSelectedRoute} />}
      />
      <Route
        path="/quiniela"
        element={<SalesScreen setSelectedRoute={setSelectedRoute} />}
      />
      <Route
        path="/bingos"
        element={<BingosScreen setSelectedRoute={setSelectedRoute} />}
      />
      <Route
        path="/reports"
        element={<ReportsScreen setSelectedRoute={setSelectedRoute} />}
      />
    </Routes>
  );
}

export default AppRoutes;
