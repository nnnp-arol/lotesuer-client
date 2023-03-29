import { useEffect, useMemo, useState } from "react";
import { SalesSellersList } from "../components/sales/SalesSellersList";
import { Sale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import { UseQueryResult } from "@tanstack/react-query";
import { helperFunctions } from "../utils/helperFunctions";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import moment from "moment";

export const BingosScreen = () => {
  const [selectedSeller, setSelectedSeller] = useState(null);
  const { data } = trpc.seller.get.useQuery();
  console.log(data);

  return (
    <div className="h-full flex overflow-y-scroll no-scrollbar px-10 flex-col">
      <div className="w-full flex py-5 justify-between bg-slate-700">
        <div className="flex flex-1 flex-col gap-5">
          <div className="w-full bg-slate-500 gap-5 flex">
            <button className="py-2 text-md text-red-500 flex-1">
              Telebingo
            </button>
            <button className="py-2 text-md text-red-500 flex-1">
              Telekino
            </button>
            <button className="py-2 text-md text-red-500 flex-1">
              Super 15
            </button>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">concurso</p>
            <select className="w-28 text-black" defaultValue="123">
              <option value="123">123</option>
              <option value="124">124</option>
              <option value="125">125</option>
              <option value="126">126</option>
            </select>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">precio</p>
            <input type="text" value="$200" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones ingresados</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones repartidos</p>
            <input type="text" value="300" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones restantes</p>
            <input type="text" value="50" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">fecha sorteo</p>
            <input type="text" value="20/06/23" className="text-black w-28" />
          </div>
          <button className="w-32 py-2 text-md text-red-500 flex-1">
            agregar nuevo concurso
          </button>
          {/* <input
            type="text"
            className={styles.dateEnabled}
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={(e) => {
              setDate(e.currentTarget.value);
              setDateLoaded(true);
            }}
          /> */}
        </div>
        <div className="flex flex-1 bg-slate-800 flex-col gap-5">
          <div className="w-full bg-slate-500 justify-center items-center flex h-10">
            <h1>Vendedores</h1>
          </div>
          <div className="flex w-full">
            <ul className="flex flex-col w-full">
              {data &&
                data.map((item) => (
                  <li
                    className={`w-full justify-center items-center flex py-1 px-5 ${
                      selectedSeller?._id === item._id ? "bg-slate-900" : null
                    }`}
                    key={item._id}
                    onClick={() => setSelectedSeller(item)}
                  >
                    <p className="basis-16 flex justify-start items-center">
                      {item.id_seller}
                    </p>
                    <p className="flex-1 flex justify-start items-center">
                      {item.name} {item.last_name}
                    </p>
                    <p className="basis-16 flex justify-start items-center">
                      11
                    </p>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          <div className="w-full bg-slate-500 justify-center items-center flex h-10 gap-2">
            <h1 className="text-center">{selectedSeller?.id_seller}</h1>
            <h1 className="text-center">
              {`${selectedSeller?.name} ${selectedSeller?.last_name}`}
            </h1>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cantidad</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">vendio</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">devuelve</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">total</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">paga</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">saldo</p>
            <input type="text" value="350" className="text-black w-28" />
          </div>
          <div className="w-full flex justify-center items-center px-16 mt-10">
            <button className="py-2 text-md rounded-3xl bg-green-600 flex-1 w-56">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
