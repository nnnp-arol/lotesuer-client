import { useEffect, useMemo, useState } from "react";
import { SalesSellersList } from "../components/sales/SalesSellersList";
import { Sale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import { UseQueryResult } from "@tanstack/react-query";
import { helperFunctions } from "../utils/helperFunctions";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import moment from "moment";

const styles = {
  dateDisabled: "text-white bg-black text-center mt-1",
  dateEnabled: "text-black text-center mt-1",
  liTextDisabled: "text-white",
  liTextEnabled: "text-black",
  liDisabled: "bg-slate-500 flex-1 flex-row flex ",
  liEnabled: "bg-slate-300 flex-1 flex-row flex ",
  gamesInputs: "text-black text-center",
};

type saleFeaturesType = {
  selectedSeller: Seller | null;
  sale: Sale[] | null;
};

type totalInfoType = {
  ventaTotal: number;
  ingresoTotal: number;
  saldoTotal: number;
  premiosTotal: number;
};

function SalesScreen() {
  const [totalInfo, setTotalInfo] = useState<totalInfoType>({
    ventaTotal: 0,
    ingresoTotal: 0,
    saldoTotal: 0,
    premiosTotal: 0,
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");
  const [dateLoaded, setDateLoaded] = useState<boolean>(false);
  const [saleFeatures, setSaleFeatures] = useState<saleFeaturesType>({
    selectedSeller: null,
    sale: null,
  });

  const { data: incomingSellers }: UseQueryResult<Seller[] | undefined> =
    trpc.seller.get.useQuery();

  const { data: incomingSalesByDay }: UseQueryResult<Sale[] | undefined> =
    trpc.sale.getSalesByDay.useQuery({ date }, { enabled: !!date });

  useEffect(() => {
    if (!!incomingSalesByDay) {
      const { ventaTotal, premiosTotal, ingresoTotal, saldoTotal } =
        helperFunctions.totalAccumulator(incomingSalesByDay);

      const gamesSum =
        ventaTotal.quiniela +
        ventaTotal.quini6 +
        ventaTotal.loto +
        ventaTotal.loto5 +
        ventaTotal.brinco +
        ventaTotal.poceada +
        ventaTotal.express;

      setTotalInfo({
        ventaTotal: gamesSum,
        premiosTotal,
        ingresoTotal,
        saldoTotal,
      });
    }
  }, [incomingSalesByDay]);

  return (
    <div className="h-full flex overflow-y-scroll no-scrollbar px-10 flex-col">
      <div className="w-full flex py-5 justify-between">
        <div>
          <p className="text-left text-white">fecha</p>
          <input
            disabled={dateLoaded}
            type="date"
            className={dateLoaded ? styles.dateDisabled : styles.dateEnabled}
            onClick={(e) => {
              e.currentTarget.value = "";
            }}
            onChange={(e) => {
              setDate(e.currentTarget.value);
              setDateLoaded(true);
            }}
          />
        </div>
        <div>
          <p className="text-left">venta total</p>
          <input
            type="text"
            className="text-blue-400 pl-2 bg-black  mt-1 w-32"
            disabled
            value={!!date ? `$ ${totalInfo.ventaTotal.toFixed(2)}` : "$"}
          />
        </div>
        <div>
          <p className="text-left">premios total</p>
          <input
            type="text"
            className="text-blue-400 pl-2 bg-black  mt-1 w-32"
            disabled
            value={!!date ? `$ ${totalInfo.premiosTotal.toFixed(2)}` : "$"}
          />
        </div>

        <div>
          <p className="text-left">saldo total</p>
          <input
            type="text"
            className="text-red-400 pl-2 bg-black  mt-1 w-32"
            disabled
            value={!!date ? `$ ${totalInfo.saldoTotal.toFixed(2)}` : "$"}
          />
        </div>
        <div>
          <p className="text-left">ingreso total</p>
          <input
            type="text"
            className="text-green-400 pl-2 bg-black  mt-1 w-32"
            disabled
            value={!!date ? `$ ${totalInfo.ingresoTotal.toFixed(2)}` : "$"}
          />
        </div>
      </div>
      {dateLoaded && (
        <div className="flex-1 flex flex-col mt-10 pb-20">
          <div className="flex items-start">
            <button className="flex gap-3" onClick={() => setDateLoaded(false)}>
              <ArrowBackIosNewOutlinedIcon color="inherit" />
              Volver
            </button>
            <div className="flex flex-1 justify-center">
              <h1 className="text-white text-2xl">
                {moment(date).format("DD-MM-YY")}
              </h1>
            </div>
          </div>

          <SalesSellersList
            sellers={incomingSellers}
            sales={incomingSalesByDay}
            setEditMode={setEditMode}
            editMode={editMode}
            date={date}
            saleFeatures={saleFeatures}
            setSaleFeatures={setSaleFeatures}
          />
        </div>
      )}
    </div>
  );
}

export default SalesScreen;
