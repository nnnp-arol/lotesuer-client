import { UseQueryResult } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useState } from "react";
import { Sale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";

import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { PdfComponent } from "../components/templates/PdfComponent";

export const ReportsScreen = () => {
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(
    moment().add(7, "day").format("YYYY-MM-DD")
  );
  const [searching, setSearching] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState("");
  const [sales, setSales] = useState<Sale[] | undefined>(undefined);
  const [inputsOrder, setInputsOrder] = useState({
    start: false,
    end: true,
    seller: true,
    game: true,
    btn1: true,
    btn2: false,
  });
  const [printMode, setPrintMode] = useState(false);

  const { data: incommingSellers }: UseQueryResult<Seller[] | undefined> =
    trpc.seller.get.useQuery();

  const {
    data: incommingSalesByRange,
    isLoading,
  }: UseQueryResult<Sale[] | undefined> = trpc.sale.getSaleByRange.useQuery(
    {
      // start: moment(startDate).format("YYYY-MM-DD"),
      start: moment(startDate).format("2023-03-01"),
      // end: moment(endDate).format("YYYY-MM-DD"),
      end: moment(endDate).format("2023-03-09"),
      seller: "",
      // selectedSeller === "todos" || !selectedSeller ? "" : selectedSeller,
    },
    {
      // enabled: searching,
      onSuccess: () => {
        setSales(incommingSalesByRange);
        setSearching(false);
      },
      onError: () => {
        return setSearching(false);
      },
    }
  );

  useEffect(() => {
    console.log(incommingSalesByRange);
  }, [incommingSalesByRange]);

  if (printMode && sales?.length) {
    return (
      <div className="h-full flex overflow-hidden px-2 flex-col">
        <div className="flex-1 flex flex-row bg-slate-600 mt-2 h-3/4 py-5">
          <div className="w-1/5 bg-slate-600 flex-col flex gap-3 h-2/3 px-5">
            <button className="flex gap-3" onClick={() => setPrintMode(false)}>
              <ArrowBackIosNewOutlinedIcon color="inherit" />
              Volver
            </button>
          </div>
          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <PdfComponent
              data={sales}
              startDate={startDate}
              endDate={endDate}
            />
          </PDFViewer>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex overflow-hidden px-2 flex-col">
      <div className="flex-1 flex flex-row bg-slate-600 mt-2 h-3/4 py-5">
        <div className="w-1/5 bg-slate-600 flex-col flex gap-3 h-2/3 px-5">
          <DatePicker
            disabled={inputsOrder.start}
            format="DD-MM-YYYY"
            value={moment(startDate)}
            onChange={(e: any) => {
              setStartDate(e.format("YYYY-MM-DD"));
              setInputsOrder({ ...inputsOrder, start: true, end: false });
            }}
            label="desde"
            onClose={() => {
              setInputsOrder({ ...inputsOrder, start: true, end: false });
            }}
          />
          <DatePicker
            label="hasta"
            disabled={inputsOrder.end}
            format="DD-MM-YYYY"
            value={moment(endDate)}
            onChange={(e: any) => {
              setEndDate(e.format("YYYY-MM-DD"));
              setInputsOrder({ ...inputsOrder, end: true, seller: false });
            }}
          />
          <h1>vendedor</h1>
          <select
            disabled={inputsOrder.seller}
            className="text-black text-center mt-1 disabled:opacity-20"
            onChange={(e) => {
              setSelectedSeller(e.currentTarget.value);
              setSearching(true);
              setInputsOrder({
                ...inputsOrder,
                seller: true,
                game: false,
                btn1: false,
                btn2: false,
              });
            }}
            onClickCapture={() => console.log("asdasdasdad")}
            defaultValue=""
          >
            <option value=""></option>
            <option value="todos">Todos</option>
            {incommingSellers?.map((seller) => (
              <option value={seller._id} key={seller._id}>
                {seller.id_seller} {seller.last_name} {seller.name}
              </option>
            ))}
          </select>
          <h1>juego</h1>
          <select
            disabled={inputsOrder.game}
            defaultValue="todos"
            className="text-black text-center mt-1 disabled:opacity-20"
          >
            <option value="todos">quiniela</option>1234
            <option value="sergio">bingos</option>
          </select>
          <button
            disabled={inputsOrder.btn1}
            onClick={() => {
              setSearching(true);
              // setSearching(!searching)
            }}
            className="bg-blue-700 rounded-xl mt-5 py-1 disabled:opacity-20"
          >
            Buscar
          </button>
          <button
            className="bg-blue-700 rounded-xl mt-5 py-1 disabled:bg-opacity-10 disabled:bg-black disabled:text-gray-300"
            disabled={inputsOrder.btn2}
            onClick={() =>
              setInputsOrder({
                start: false,
                end: true,
                seller: true,
                game: true,
                btn1: true,
                btn2: false,
              })
            }
          >
            Cancelar
          </button>
        </div>
        <div className="flex-1 bg-slate-600 overflow-y-scroll px-2 h-full">
          <table className="border-collapse w-full m-auto  bg-slate-800 px-10">
            <thead className="bg-slate-900 text-slate-300 border-b border-slate-600 h-12 w-1/2">
              <tr>
                <th className="text-left w-1/6 pl-2">fecha</th>
                <th className="text-left w-1/12 pl-2">vendedor</th>
                <th className="text-left w-1/12 pl-2">quiniela</th>
                <th className="text-left w-1/12 pl-2">quini6</th>
                <th className="text-left w-1/12 pl-2">loto</th>
                <th className="text-left w-1/12 pl-2">loto5</th>
                <th className="text-left w-1/12 pl-2">brinco</th>
                <th className="text-left w-1/12 pl-2">poceada</th>
                <th className="text-left w-1/12 pl-2">express</th>
                <th className="text-left w-1/12 pl-2">premios</th>
                <th className="text-left w-1/12 pl-2">saldo</th>
                <th className="text-left w-1/12 pl-2">paga</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {!isLoading ? (
                sales?.map((sale) => (
                  <tr
                    key={sale._id}
                    className="even:bg-slate-800 even:text-gray-300 odd:bg-slate-700 odd:text-gray-400 h-12"
                  >
                    <td className="text-left w-1/6 pl-2">{sale.date}</td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.seller.id_seller}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.quiniela}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.quini6}
                    </td>
                    <td className="text-left w-1/12 pl-2">{sale.games.loto}</td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.loto5}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.brinco}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.poceada}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.games.express}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.totals.premios}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.totals.saldo}
                    </td>
                    <td className="text-left w-1/12 pl-2">
                      {sale.totals.paga}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>loading</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex flex-1 justify-end items-start pr-5">
        <button
          className="bg-blue-700 rounded-xl mt-2 py-1 px-4"
          onClick={() => setPrintMode(true)}
        >
          Imprimir
        </button>
      </div>
    </div>
  );
};

const styles = {
  td: "",
};
