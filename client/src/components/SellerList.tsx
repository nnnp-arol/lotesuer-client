import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { trpc } from "../utils/trpc";
import SearchIcon from "@mui/icons-material/Search";
import { FadeLoader, MoonLoader } from "react-spinners";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import { Button } from "@mui/material";
import { Seller } from "../utils/interfaces";
import { useSnackbar } from "notistack";

const styles = {
  mainContainer: "w-2/5 flex-col mr-10",
  searchContainer: "mb-5 gap-3 flex items-center",
  searchInput: "rounded-md px-2 py-1 text-black",
  cardsContainer: "flex flex-1 flex-col",
};

type SellerListPropsType = {
  selectedSeller: Seller | null;
  setSelectedSeller: React.Dispatch<React.SetStateAction<Seller | null>>;
  sellers: unknown[] | undefined;
  searchBy: string;
  setSearchBy: React.Dispatch<React.SetStateAction<string>>;
  addMode: boolean;
};

function SellerList({
  selectedSeller,
  setSelectedSeller,
  sellers,
  searchBy,
  setSearchBy,
  addMode,
}: SellerListPropsType) {
  const searchRef = useRef<HTMLInputElement | null>(null);
  const iconSearchRef = useRef<HTMLButtonElement | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  useLayoutEffect(() => {
    document.addEventListener("keydown", (e) => {
      if (e.key === "F1") {
        setShowSearch(true);
        searchRef.current?.focus();
      }
      if (e.key === "Escape") {
        setShowSearch(false);
      }
    });
  }, []);

  return (
    <div className="w-2/5 flex-col mr-10">
      <div className="flex flex-1 bg-slate-700 flex-col rounded-xl py-4 h-5/6">
        <div className="flex h-10">
          <div className="flex flex-1 justify-start items-center pl-5 gap-2">
            <div className="w-2 h-2 rounded-full bg-slate-400"></div>
            <h1 className="text-2xl text-slate-400">vendedores</h1>
          </div>
          <div className="flex flex-1 justify-end items-center gap-2 pr-5">
            <Button
              ref={iconSearchRef}
              size="small"
              onClick={() => {
                setShowSearch(!showSearch);
                setTimeout(() => {
                  searchRef?.current?.focus();
                }, 100);
              }}
            >
              <SearchIcon />
            </Button>
            {showSearch && (
              <input
                ref={searchRef}
                type="text"
                placeholder="buscar"
                className="rounded-md px-2 py-1 text-white bg-slate-800"
                onChange={(e) => setSearchBy(e.target.value)}
                onBlur={() => setShowSearch(false)}
                value={searchBy}
              />
            )}
          </div>
        </div>
        <div className="w-full justify-center items-center flex py-1 px-5 border-b border-slate-600">
          <p className="text-slate-400 font-semibold basis-16 flex justify-start items-center">
            num
          </p>
          <p className="text-slate-400 font-semibold flex-1 flex justify-start items-center">
            vendedor
          </p>
          <p className="text-slate-400 font-semibold basis-24 flex justify-start items-center">
            maquina
          </p>
        </div>
        <div className="flex w-full mt-2 no-scrollbar overflow-y-scroll h-full">
          <ul className="flex flex-col w-full ">
            {sellers &&
              sellers.map((item: any) => (
                <li
                  className={`w-full justify-center items-center flex py-1 px-5 ${
                    selectedSeller?._id === item._id
                      ? "bg-slate-300 text-slate-900"
                      : null
                  }`}
                  key={item._id}
                  onClick={() => {
                    if (addMode) {
                      return enqueueSnackbar("Estas en modo editar", {
                        variant: "info",
                      });
                    }
                    console.log(item);
                    setSelectedSeller(item);
                  }}
                >
                  <p className="basis-16 flex justify-start items-center text-slate-900">
                    {item.id_seller}
                  </p>
                  <p className="flex-1 flex justify-start items-center">
                    {item.name} {item.last_name}
                  </p>
                  <p className="basis-16 flex justify-start items-center text-slate-900">
                    {item.machine_number}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SellerList;
