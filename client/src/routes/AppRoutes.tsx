import { Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import SalesScreen from "../screens/SalesScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import SellersScreen from "../screens/SellersScreen";
import { BingosScreen } from "../screens/BingosScreen";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} index />
      <Route path="/home" element={<Home />} />
      <Route path="/sellers" element={<SellersScreen />} />
      <Route path="/quiniela" element={<SalesScreen />} />
      <Route path="/bingos" element={<BingosScreen />} />
      <Route path="/reports" element={<ReportsScreen />} />
    </Routes>
  );
}

export default AppRoutes;
