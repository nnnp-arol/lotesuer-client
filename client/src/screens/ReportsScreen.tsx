import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import moment from "moment";
import { useEffect, useLayoutEffect, useState } from "react";
import { BingoSale, Sale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { PdfComponent } from "../components/templates/PdfComponent";
import { useNavigate } from "react-router-dom";
import { OnlyReadInput } from "../components/atoms/OnlyReadInput";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import { Button } from "@mui/material";
import { FadeLoader, MoonLoader } from "react-spinners";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";

export const ReportsScreen = ({
  setSelectedRoute,
}: {
  setSelectedRoute: (v: string) => void;
}) => {
  setSelectedRoute("report");
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<string>(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState<string>(
    moment().endOf("month").format("YYYY-MM-DD")
  );

  const [searching, setSearching] = useState(false);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [game, setGame] = useState("quiniela");
  const [foundSale, setFoundSale] = useState([]);
  const [searchBy, setSearchBy] = useState("");

  const [printMode, setPrintMode] = useState(false);

  const {
    data: allGames,
    isLoading: loading,
    status,
    remove,
    refetch,
    isInitialLoading,
  }: UseQueryResult<any> = trpc.allGames.getAllGamesSales.useQuery(
    { end: endDate, start: startDate, game },
    {
      enabled: false,
      onSuccess: (data) => {
        setTimeout(() => {
          setSearching(false);
        }, 200);
      },
      onError: (error) => {
        remove();
        setSearching(false);
      },
    }
  );

  useEffect(() => {
    if (!startDate) {
      setStartDate(moment().startOf("month").format("YYYY-MM-DD"));
    }
    if (!endDate) {
      setEndDate(moment().endOf("month").format("YYYY-MM-DD"));
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (!!allGames) {
      if (!!allGames.data && !!allGames.data.length) {
        if (!!searchBy) {
          const filteredSales = allGames.data.filter((i: any) => {
            return i.seller.id_seller.includes(searchBy);
          });
          return setFoundSale(
            filteredSales
              .sort((a: any, b: any) => {
                if (a.seller.id_seller < b.seller.id_seller) {
                  return -1;
                }
              })
              .sort((a: any, b: any) => {
                if (a.date < b.date) {
                  return -1;
                }
              })
          );
        }
        return setFoundSale(
          allGames.data
            .sort((a: any, b: any) => {
              if (a.seller.id_seller < b.seller.id_seller) {
                return -1;
              }
            })
            .sort((a: any, b: any) => {
              if (a.date < b.date) {
                return -1;
              }
            })
        );
      }
    }
  }, [allGames, searchBy, searching]);

  useEffect(() => {
    const lis: any = document.getElementById("salesContainer")?.children;
    const upAndDown = (e: any) => {
      if (lis?.length) {
        const lastIndex = lis.length - 1;

        if (e.key === "ArrowDown") {
          return lis[index === lastIndex ? 0 : index + 1].click();
        }
        if (e.key === "ArrowUp") {
          return lis[index === 0 ? lastIndex : index - 1].click();
        }
      }
    };
    document.addEventListener("keydown", upAndDown);
    return () => document.removeEventListener("keydown", upAndDown);
  }, [selectedRow, index]);

  const RenderTable: () => JSX.Element = () => {
    if (!!allGames) {
      if (allGames.game === "quiniela") {
        return (
          <>
            <div className="flex w-full py-2 bg-slate-700 px-2">
              <h1 className="basis-32 ">fecha</h1>
              <h1 className="basis-16 ">num</h1>
              <h1 className="basis-28 ">quiniela</h1>
              <h1 className="basis-28 ">quini 6</h1>
              <h1 className="basis-28 ">loto</h1>
              <h1 className="basis-28 ">loto 5</h1>
              <h1 className="basis-28 ">brinco</h1>
              <h1 className="basis-28 ">poceada</h1>
              <h1 className="basis-28 ">express</h1>
              <h1 className="basis-28 ">premios</h1>
              <h1 className="basis-28 ">saldo</h1>
              <h1 className="basis-28 ">paga</h1>
            </div>
            <div
              className="flex overflow-y-scroll no-scrollbar h-5/6 flex-col border-y border-slate-500 border-opacity-50"
              id="salesContainer"
            >
              {!!foundSale && !!foundSale.length ? (
                foundSale.map((sale: Sale, inx: number) => (
                  <div
                    onClick={() => {
                      setIndex(inx);
                      setSelectedRow(sale?._id || null);
                    }}
                    className={` border-b border-slate-500 border-opacity-50
                    ${
                      selectedRow === sale?._id
                        ? styles.selectedTableRow
                        : inx % 2
                        ? styles.evenTableRow
                        : styles.oddTableRow
                    }
                  `}
                  >
                    <h1 className="basis-32">
                      {moment(sale?.date).format("DD-MM-YY")}
                    </h1>
                    <h1 className="basis-16 ">{sale?.seller?.id_seller}</h1>
                    <h1 className="basis-28 ">{sale?.games.quiniela}</h1>
                    <h1 className="basis-28 ">{sale?.games?.quini6}</h1>
                    <h1 className="basis-28 ">{sale?.games?.loto}</h1>
                    <h1 className="basis-28 ">{sale?.games?.loto5}</h1>
                    <h1 className="basis-28 ">{sale?.games?.brinco}</h1>
                    <h1 className="basis-28 ">{sale?.games?.poceada}</h1>
                    <h1 className="basis-28 ">{sale?.games?.express}</h1>
                    <h1 className="basis-28 ">{sale?.totals?.premios}</h1>
                    <h1
                      className={`basis-28 ${
                        parseFloat(sale?.totals?.saldo) > 0
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {sale?.totals?.saldo}
                    </h1>
                    <h1 className="basis-28 ">{sale?.totals?.paga}</h1>
                  </div>
                ))
              ) : (
                <div className="flex flex-1 justify-center items-center">
                  <MoonLoader size={30} color="white" />
                </div>
              )}
            </div>
          </>
        );
      }
      return (
        <>
          <div className="flex w-full py-2 bg-slate-700 px-2 ">
            <h1 className="basis-32 ">fecha sorteo</h1>
            <h1 className="basis-28 ">sorteo</h1>
            <h1 className="basis-16 ">num</h1>
            <h1 className="basis-28 ">cartones</h1>
            <h1 className="basis-28 ">devolucion</h1>
            <h1 className="basis-28 ">paga</h1>
            <h1 className="basis-28 ">saldo</h1>
          </div>
          <div
            className="flex overflow-y-scroll no-scrollbar h-5/6 flex-col border-y border-slate-500 border-opacity-50"
            id="salesContainer"
          >
            {!!foundSale && foundSale.length ? (
              foundSale.map((sale: any, inx) => (
                <div
                  onClick={() => {
                    setIndex(inx);
                    setSelectedRow(sale?._id || null);
                  }}
                  className={` border-b border-slate-500 border-opacity-50
                    ${
                      selectedRow === sale._id
                        ? styles.selectedTableRow
                        : inx % 2
                        ? styles.evenTableRow
                        : styles.oddTableRow
                    }
                  `}
                >
                  <h1 className="basis-32">
                    {moment(sale.fecha_sorteo).format("DD-MM-YY")}
                  </h1>
                  <h1 className="basis-28 ">{sale.sorteo}</h1>
                  <h1 className="basis-16 ">{sale.seller.id_seller}</h1>
                  <h1 className="basis-28 ">{sale.cartones}</h1>
                  <h1 className="basis-28 ">{sale.devolucion}</h1>
                  <h1 className="basis-28 ">{sale.paga}</h1>
                  <h1
                    className={`basis-28 ${
                      parseFloat(sale?.saldo) > 0 ? "text-red-500" : ""
                    }`}
                  >
                    {sale.saldo}
                  </h1>
                </div>
              ))
            ) : (
              <div className="flex flex-1 justify-center items-center ">
                <MoonLoader size={30} color="white" />
              </div>
            )}
          </div>
        </>
      );
    }
    return (
      <div className="flex flex-1 justify-center items-center flex-row gap-2">
        <ErrorOutlinedIcon />
        <h1>No hay informacion</h1>
      </div>
    );
  };

  if (printMode && foundSale?.length) {
    return (
      <div className="h-full flex overflow-hidden px-2 flex-col">
        <div className="flex-1 flex flex-row  mt-2 h-3/4 py-5">
          <div className="w-1/5  flex-col flex gap-3 h-2/3 px-5">
            <button className="flex gap-3" onClick={() => setPrintMode(false)}>
              <ArrowBackIosNewOutlinedIcon color="inherit" />
              Volver
            </button>
          </div>
          <PDFViewer style={{ width: "100%", height: "90vh" }}>
            <PdfComponent
              data={foundSale}
              startDate={startDate}
              endDate={endDate}
              game={game}
            />
          </PDFViewer>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex px-5 flex-col">
      <div className="flex w-full py-10 m-auto justify-between items-center px-10">
        <div className="flex flex-row w-1/2 m-auto">
          <OnlyReadInput
            value={startDate}
            onlyR={false}
            borderColor="border-blue-500"
            onChange={(e: any) => {
              setStartDate(e.currentTarget.value);
            }}
            onClick={(e: any) => {
              e.currentTarget.value = "";
            }}
            labelColor="text-blue-500"
            textColor="text-white"
            label="DESDE"
            type="date"
          />
          <OnlyReadInput
            value={endDate}
            onlyR={false}
            borderColor="border-blue-500"
            onChange={(e: any) => {
              setEndDate(e.currentTarget.value);
            }}
            onClick={(e: any) => {
              e.currentTarget.value = "";
            }}
            labelColor="text-blue-500"
            textColor="text-white"
            label="HASTA"
            type="date"
          />
        </div>
        <Button
          size="small"
          variant="outlined"
          className="gap-2"
          onClick={() => {
            setPrintMode(true);
          }}
        >
          <PrintOutlinedIcon color="inherit" />
          imprimir
        </Button>
      </div>
      <div className="flex-1 flex flex-row bg-slate-900 mt-2 h-3/4 py-5">
        <div className="w-1/5 bg-slate-900 flex-col flex gap-3 mr-5 border border-opacity-10 border-white h-3/4 p-5 ">
          <h1>vendedor</h1>
          <input
            type="text"
            className={styles.gamesInp}
            value={searchBy}
            onChange={(e) => {
              setSearchBy(e.target.value);
            }}
          />
          <h1>juego</h1>
          <select
            defaultValue="todos"
            className={styles.gamesInp}
            onChange={(e) => {
              remove();
              setSearching(false);
              setGame(e.target.value);
            }}
          >
            <option value="quiniela">quiniela</option>
            <option value="telebingo">telebingo</option>
            <option value="telekino">telekino</option>
            <option value="super15">super 15</option>
          </select>
          <div className="flex w-full flex-col gap-5 mt-10">
            <Button
              variant="contained"
              // color={!!searching ? "error" : "info"}
              onClick={() => {
                refetch();
                setSearching(!searching);
              }}
            >
              {isInitialLoading ? (
                <MoonLoader size={19} loading={searching} />
              ) : (
                "Buscar"
              )}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                remove();
                setSearching(false);
              }}
            >
              limpiar
            </Button>
          </div>
        </div>
        <div className="flex-1 bg-slate-900 px-2 h-full">{RenderTable()}</div>
      </div>
    </div>
  );
};

const styles = {
  selectedTableRow:
    "flex w-full py-2 px-2 bg-slate-800 hover:cursor-pointer text-slate-200 py-5",
  oddTableRow:
    "flex w-full py-2 px-2 hover:cursor-pointer hover:text-slate-600 bg-lima-100 text-slate-400 text-sm",
  evenTableRow:
    "flex w-full py-2 px-2 hover:cursor-pointer hover:text-slate-600 bg-lima-200 text-slate-400 text-sm",
  dateDisabled: "text-white bg-black text-center mt-1",
  dateEnabled: "text-black text-center mt-1",
  liTextDisabled: "text-white",
  liTextEnabled: "text-black",
  liDisabled: "bg-slate-500 flex-1 flex-row flex ",
  liEnabled: "bg-slate-300 flex-1 flex-row flex ",
  gamesInputs: "text-black text-center",
  inpContainer: "flex w-full flex-row justify-between py-3 px-10",
  gamesInp: "text-black rounded-sm bg-slate-400 pl-1 disabled:opacity-50",
};
