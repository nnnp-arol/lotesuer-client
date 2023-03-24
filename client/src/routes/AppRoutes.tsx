import { Route, Routes } from "react-router-dom";
import Home from "../screens/Home";
import SalesScreen from "../screens/SalesScreen";
import { ReportsScreen } from "../screens/ReportsScreen";
import SellersScreen from "../screens/SellersScreen";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} index />
      <Route path="/home" element={<Home />} />
      <Route path="/sellers" element={<SellersScreen />} />
      <Route path="/sales" element={<SalesScreen />} />
      <Route path="/reports" element={<ReportsScreen />} />
    </Routes>
  );
}

export default AppRoutes;
