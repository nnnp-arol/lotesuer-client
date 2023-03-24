import React from "react";
import SellerForm from "../components/SellerForm";
import SellerList from "../components/SellerList";

function SellersScreen() {
  return (
    <div className="h-full flex overflow-y-scroll pt-20 no-scrollbar px-10">
      <SellerForm />
      <SellerList />
    </div>
  );
}

export default SellersScreen;
