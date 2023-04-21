import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Sale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import { helperFunctions } from "../utils/helperFunctions";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import { Button } from "@mui/material";
import { OnlyReadInput } from "../components/atoms/OnlyReadInput";
import SearchIcon from "@mui/icons-material/Search";
import { useSnackbar } from "notistack";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { CustomDialog } from "../components/common/CustomDialog";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const initialGamesValues = {
  quiniela: "0.00",
  quini6: "0.00",
  loto: "0.00",
  loto5: "0.00",
  brinco: "0.00",
  poceada: "0.00",
  express: "0.00",
  premios: "0.00",
  total: "0.00",
  paga: "0.00",
  saldo: "0.00",
  machineRent: true,
};

const styles = {
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

type saleFeaturesType = {
  selectedSeller: Seller | null;
  sale: Sale | null;
  index: number | null;
};

type totalInfoType = {
  ventaTotal: number;
  ingresoTotal: number;
  saldoTotal: number;
  premiosTotal: number;
};

function SalesScreen({
  setSelectedRoute,
}: {
  setSelectedRoute: (v: string) => void;
}) {
  setSelectedRoute("sales");
  const btnCancelRef = useRef<HTMLButtonElement | null>(null);
  const btnGuardarRef = useRef<HTMLButtonElement | null>(null);
  const quinielaRef = useRef<HTMLInputElement | null>(null);
  const quini6Ref = useRef<HTMLInputElement | null>(null);
  const lotoRef = useRef<HTMLInputElement | null>(null);
  const loto5Ref = useRef<HTMLInputElement | null>(null);
  const brincoRef = useRef<HTMLInputElement | null>(null);
  const poceadaRef = useRef<HTMLInputElement | null>(null);
  const expressRef = useRef<HTMLInputElement | null>(null);
  const premiosRef = useRef<HTMLInputElement | null>(null);
  const pagaRef = useRef<HTMLInputElement | null>(null);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const iconSearchRef = useRef<HTMLButtonElement | null>(null);
  const firstRow = useRef<HTMLDivElement | null>(null);

  const [gamesFields, setGamesFields] = useState(initialGamesValues);

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [pressEnter, setPressEnter] = useState<boolean>(false);
  const [dialogFrom, setDialogFrom] = useState<string>("save");

  const [searchBy, setSearchBy] = useState<string>("");
  const [sellersLi, setSellersLi] = useState<any>([]);
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
    index: null,
    sale: null,
  });

  const percents = useMemo(() => {
    return {
      quiniela: saleFeatures.selectedSeller?.percent.quiniela,
      quini6: saleFeatures.selectedSeller?.percent.quini6,
      loto: saleFeatures.selectedSeller?.percent.loto,
      loto5: saleFeatures.selectedSeller?.percent.loto5,
      brinco: saleFeatures.selectedSeller?.percent.brinco,
      poceada: saleFeatures.selectedSeller?.percent.poceada,
      express: saleFeatures.selectedSeller?.percent.express,
    };
  }, [saleFeatures.selectedSeller]);

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const { data: incomingSellers }: UseQueryResult<Seller[] | undefined> =
    trpc.seller.get.useQuery({ searchBy: searchBy });

  const { data: incomingSalesByDay }: UseQueryResult<Sale[] | undefined> =
    trpc.sale.getSalesByDay.useQuery({ date }, { enabled: !!date });

  const createSale = trpc.sale.createSale.useMutation();
  const updateSale = trpc.sale.updateSale.useMutation();

  //get refs of each seller's LI components
  useLayoutEffect(() => {
    const lis = document.getElementById("sellersContainer")?.children;
    setSellersLi(Array.from(lis?.length ? lis : []));
  }, [incomingSellers]);

  //will do all game's fields operations
  useEffect(() => {
    const {
      quiniela,
      brinco,
      express,
      loto,
      loto5,
      poceada,
      premios,
      quini6,
      paga,
      machineRent,
    } = gamesFields;
    const sumTotal =
      helperFunctions.convertVal(quiniela, percents.quiniela) +
      helperFunctions.convertVal(quini6, percents.quini6) +
      helperFunctions.convertVal(loto, percents.loto) +
      helperFunctions.convertVal(loto5, percents.loto5) +
      helperFunctions.convertVal(brinco, percents.brinco) +
      helperFunctions.convertVal(poceada, percents.poceada) +
      helperFunctions.convertVal(express, percents.express);

    const machineRentPrice =
      saleFeatures?.selectedSeller?.percent?.machineRent || "0";

    const total = machineRent
      ? (sumTotal + helperFunctions.convertVal(machineRentPrice)).toFixed(2)
      : sumTotal.toFixed(2);
    const saldo = (
      parseFloat(total) -
      helperFunctions.convertVal(premios) -
      helperFunctions.convertVal(paga)
    ).toFixed(2);
    setGamesFields({ ...gamesFields, total, saldo });
  }, [
    gamesFields.quiniela,
    gamesFields.brinco,
    gamesFields.express,
    gamesFields.loto,
    gamesFields.loto5,
    gamesFields.poceada,
    gamesFields.premios,
    gamesFields.quini6,
    gamesFields.paga,
    gamesFields.machineRent,
  ]);

  //shorcuts (enter,arrowdown, arrowup)
  useLayoutEffect(() => {
    const upAndDown = (e: any) => {
      const lastIndex = sellersLi.length - 1;

      if (e.key === "Escape") {
        if (!!editMode) {
          return btnCancelRef.current?.click();
        }
        if (!!showSearch) {
          setSearchBy("");
          return setShowSearch(false);
        }
        if (
          !editMode &&
          !showSearch &&
          !showDialog &&
          !!saleFeatures.selectedSeller
        ) {
          setSearchBy("");
          return setSaleFeatures({
            sale: null,
            selectedSeller: null,
            index: null,
          });
        }
        return;
      }

      if (e.key === "F1") {
        if (!editMode && !!dateLoaded) {
          setShowSearch(true);
          return setTimeout(() => {
            searchRef.current?.focus();
          }, 200);
        }
        return;
      }
      if (e.key === "Enter") {
        if (!!dateLoaded) {
          if (!!showDialog) {
            return setPressEnter(true);
          }
          if (!!showSearch) {
            setShowSearch(false);
            sellersLi[0].click();
            return sellersLi[0].focus();
          }
          if (!editMode) {
            setEditMode(true);
            return setTimeout(() => {
              quinielaRef?.current?.focus();
            }, 100);
          } else {
            if (e?.target?.name === "quiniela") {
              return quini6Ref?.current?.focus();
            }
            if (e?.target?.name === "quini6") {
              return lotoRef?.current?.focus();
            }
            if (e?.target?.name === "loto") {
              return loto5Ref?.current?.focus();
            }
            if (e?.target?.name === "loto5") {
              return brincoRef?.current?.focus();
            }
            if (e?.target?.name === "brinco") {
              return poceadaRef?.current?.focus();
            }
            if (e?.target?.name === "poceada") {
              return expressRef?.current?.focus();
            }
            if (e?.target?.name === "express") {
              return premiosRef?.current?.focus();
            }
            if (e?.target?.name === "premios") {
              return pagaRef?.current?.focus();
            }
            if (e?.target?.name === "paga") {
              return btnGuardarRef?.current?.click();
            }
            return;
          }
        }
        return enqueueSnackbar("No hay fecha cargada", {
          variant: "error",
        });
      }
      if (e.key === "ArrowDown") {
        if (!!editMode || !!showSearch) {
          return;
        }
        if (saleFeatures.index === null || lastIndex === saleFeatures.index) {
          sellersLi[0].focus();
          sellersLi[0].scrollIntoView();
          return sellersLi[0].click();
        }
        if (saleFeatures.index >= 0) {
          sellersLi[saleFeatures.index + 1].click();
          sellersLi[saleFeatures.index + 1].scrollIntoView();
          return sellersLi[saleFeatures.index + 1].focus();
        }
      }
      if (e.key === "ArrowUp") {
        if (!!editMode || !!showSearch) {
          return;
        }
        if (!saleFeatures.index) {
          sellersLi[lastIndex].focus();
          sellersLi[lastIndex].scrollIntoView();
          return sellersLi[lastIndex].click();
        }
        if (saleFeatures.index > 0) {
          sellersLi[saleFeatures.index - 1].click();
          sellersLi[saleFeatures.index - 1].scrollIntoView();
          return sellersLi[saleFeatures.index - 1].focus();
        }
      }
    };
    document.addEventListener("keydown", upAndDown);
    return () => document.removeEventListener("keydown", upAndDown);
  }, [sellersLi, saleFeatures, editMode, dateLoaded, showDialog, showSearch]);

  const onSave = () => {
    const {
      brinco,
      express,
      loto,
      loto5,
      paga,
      poceada,
      premios,
      quini6,
      quiniela,
      saldo,
      total,
      machineRent,
    } = gamesFields;

    const games = { quiniela, quini6, loto, loto5, brinco, poceada, express };
    const totals = { premios, saldo, total, paga, machineRent };
    const status = parseInt(saldo) === 0 ? 0 : parseInt(saldo) > 0 ? -1 : 1;

    if (!!saleFeatures.sale?._id) {
      return updateSale.mutate(
        { id: saleFeatures.sale?._id, games, totals, status },
        {
          onSuccess: () => {
            enqueueSnackbar("Venta actualizada correctamente", {
              variant: "success",
            });
            setEditMode(false);
            queryClient.invalidateQueries();
          },
        }
      );
    }
    createSale.mutate(
      {
        games,
        totals,
        seller: saleFeatures.selectedSeller?._id || "",
        date: date,
        status,
      },
      {
        onSuccess: () => {
          enqueueSnackbar("Venta registrada correctamente", {
            variant: "success",
          });
          setEditMode(false);
          queryClient.invalidateQueries();
        },
        onError: (error) => {
          enqueueSnackbar(error.message, {
            variant: "error",
          });
          setEditMode(false);
        },
      }
    );
  };

  const verifyIfChanged = () => {
    const { total: total, saldo: saldo } = gamesFields;
    if (!!saleFeatures.sale?.totals) {
      const { total: saleTotal, saldo: saleSaldo } = saleFeatures.sale.totals;
      if (total !== saleTotal || saldo !== saleSaldo) {
        return true;
      }
      return false;
    }
    if (
      (total === "3.50" || total === "0.00") &&
      (saldo === "3.50" || saldo === "0.00")
    ) {
      return false;
    }
    return true;
  };

  const handlerChange = (e: any) => {
    setGamesFields({ ...gamesFields, [e.currentTarget.name]: e.target.value });
  };

  const handlerBlur = (e: any) => {
    const targetValue = e.currentTarget.value;
    if (parseFloat(targetValue)) {
      return setGamesFields({
        ...gamesFields,
        [e.target.name]: parseFloat(targetValue).toFixed(2),
      });
    }
    setGamesFields({ ...gamesFields, [e.target.name]: "0.00" });
  };

  const handleUpAndDown = (down: boolean) => {
    if (saleFeatures.index === null) {
      if (incomingSellers?.length) {
        if (down) {
          firstRow?.current?.focus();
          firstRow?.current?.click();
          return;
        } else {
          return setSaleFeatures({
            ...saleFeatures,
            selectedSeller: incomingSellers[incomingSellers.length - 1],
            index: incomingSellers.length - 1,
          });
        }
      }
      return;
    }
    if (incomingSellers?.length) {
      const index = !!saleFeatures.index ? saleFeatures.index : 0;
      if (down) {
        if (index === incomingSellers.length - 1) {
          return;
        }
        return setSaleFeatures({
          ...saleFeatures,
          selectedSeller: incomingSellers[index + 1],
          index: index + 1,
        });
      }
      if (index === 0) {
        return;
      }
      return setSaleFeatures({
        ...saleFeatures,
        selectedSeller: incomingSellers[index - 1],
        index: index - 1,
      });
    }
  };

  //get totals values of the day selected
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

  //get a sale when i have match between one seller and one sale
  useEffect(() => {
    const id = saleFeatures.selectedSeller?._id;
    if (!!id) {
      setSaleFeatures({
        ...saleFeatures,
        sale:
          incomingSalesByDay?.filter((item) => {
            return item.seller._id === id;
          })[0] || null,
      });
    }
  }, [saleFeatures.selectedSeller]);

  //render status to each seller
  const RenderStatus: (props: {
    id: string | undefined;
  }) => ReactJSXElement = ({ id }) => {
    const ownSale = incomingSalesByDay?.find((item) => item.seller._id === id);
    if (ownSale) {
      if (ownSale.status < 0) {
        return (
          <p className="w-2 h-2 bg-red-500 rounded-full border border-red-600 m-auto "></p>
        );
      }
      return (
        <p className="w-2 h-2 bg-green-400 rounded-full border border-green-600 m-auto "></p>
      );
    }
    return (
      <p className="w-2 h-2 bg-slate-400 rounded-full border border-slate-600 m-auto "></p>
    );
  };
  //fill all the game form fields with sale's values if exist, otherwise with null values
  useEffect(() => {
    if (!!saleFeatures.sale) {
      const { games, totals } = saleFeatures.sale;
      setGamesFields({
        ...games,
        ...totals,
      });
    } else {
      setGamesFields(initialGamesValues);
    }
  }, [saleFeatures]);

  return (
    <div className="h-full flex px-10 flex-col pb-5 max-h-full overflow-clip">
      <div className="w-full flex py-10">
        <div className="w-1/12">
          <button
            disabled={!dateLoaded}
            className={`flex gap-3 items-center justify-center ${
              dateLoaded ? "" : "text-slate-600"
            } `}
            onClick={() => {
              setDate("");
              setDateLoaded(false);
            }}
          >
            <ArrowBackIosNewOutlinedIcon color="inherit" />
            Salir
          </button>
        </div>
        <div className="flex w-1/3 m-auto">
          <OnlyReadInput
            value={date}
            onlyR={false}
            borderColor="border-white"
            disabled={dateLoaded}
            onChange={(e: any) => {
              setDate(e.currentTarget.value);
              setDateLoaded(true);
            }}
            onClick={(e: any) => {
              e.currentTarget.value = "";
            }}
            labelColor="text-white"
            textColor="text-white"
            label="FECHA"
            type="date"
          />
        </div>
        <div>
          <Button
            size="small"
            variant="outlined"
            className="gap-2"
            onClick={() => {}}
          >
            <PrintOutlinedIcon color="inherit" />
            imprimir
          </Button>
        </div>
      </div>
      <div className="w-full flex justify-between">
        <OnlyReadInput
          borderColor="border-blue-500"
          labelColor="text-blue-500"
          textColor="text-blue-500"
          label="VENTA TOTAL"
          type="text"
          value={!!date ? `$ ${totalInfo.ventaTotal.toFixed(2)}` : "$"}
        />
        <OnlyReadInput
          borderColor="border-yellow-500"
          labelColor="text-yellow-500"
          textColor="text-yellow-500"
          label="PREMIOS TOTAL"
          type="text"
          value={!!date ? `$ ${totalInfo.premiosTotal.toFixed(2)}` : "$"}
        />
        <OnlyReadInput
          borderColor="border-red-500"
          labelColor="text-red-500"
          textColor="text-red-500"
          label="SALDO TOTAL"
          type="text"
          value={!!date ? `$ ${totalInfo.saldoTotal.toFixed(2)}` : "$"}
        />
        <OnlyReadInput
          borderColor="border-green-500"
          labelColor="text-green-500"
          textColor="text-green-500"
          label="INGRESO TOTAL"
          type="text"
          value={!!date ? `$ ${totalInfo.ingresoTotal.toFixed(2)}` : "$"}
        />
      </div>

      <div className="flex flex-1 mt-12 rounded-md h-1/2">
        <div className="flex w-1/3 items-center flex-col border-b-4 border-blue-500">
          <div className="w-full flex justify-center py-2 bg-slate-700 px-2 rounded-md">
            <div className="flex flex-1 justify-start items-center pl-5 gap-2 ">
              <div className="w-2 h-2 rounded-full bg-slate-400 "></div>
              <h1 className="text-2xl text-slate-400">vendedores</h1>
            </div>
            <div className="flex flex-1 justify-end items-center gap-1">
              <Button
                ref={iconSearchRef}
                size="small"
                onClick={() => {
                  if (!dateLoaded) return;
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
                  className="rounded-md px-2 py-1 text-white bg-slate-800 w-full"
                  onChange={(e) => setSearchBy(e.target.value)}
                  onBlur={() => setShowSearch(false)}
                  value={searchBy}
                />
              )}
            </div>
          </div>
          <div className="w-full flex pb-2 px-1 border-b-4 border-blue-500 py-4">
            <h1 className="basis-20 ">num</h1>
            <h1 className="flex flex-1">vendedor</h1>
            <h1 className="basis-20">status</h1>
          </div>
          <div
            className="w-full flex flex-col overflow-y-scroll no-scrollbar text-slate-500"
            id="sellersContainer"
          >
            {incomingSellers?.map((s, index) => {
              return (
                <div
                  ref={index === 0 ? firstRow : null}
                  className={`hover:cursor-pointer ${
                    index === incomingSellers?.length - 1
                      ? ""
                      : "border-b border-blue-600"
                  } w-full flex py-2 px-1 ${
                    saleFeatures.selectedSeller?._id === s._id
                      ? "bg-blue-800 text-white"
                      : ""
                  }`}
                  onClick={(e) => {
                    if (!dateLoaded) {
                      return;
                    }
                    if (!!editMode) {
                      return;
                    }
                    setSaleFeatures({
                      ...saleFeatures,
                      selectedSeller: s,
                      index,
                    });
                  }}
                  onDoubleClick={() => {
                    if (!dateLoaded) {
                      return;
                    }
                    if (!!editMode) {
                      return;
                    }
                    setSaleFeatures({
                      ...saleFeatures,
                      selectedSeller: s,
                      index,
                    });
                    setEditMode(true);
                    setTimeout(() => {
                      quinielaRef.current?.focus();
                    }, 100);
                  }}
                >
                  <h1 className="basis-20">{s.id_seller}</h1>
                  <h1 className="flex flex-1">
                    {s.last_name} {s.name}
                  </h1>
                  <div className="basis-28 justify-center items-center flex">
                    <RenderStatus id={s._id} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-1 flex-col ml-10  ">
          <div className="flex flex-row px-5 bg-slate-700 rounded-md ">
            <div className="flex flex-1 justify-start items-center gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              {!!saleFeatures.selectedSeller ? (
                <>
                  <h1 className="text-2xl text-slate-500">
                    {saleFeatures.selectedSeller?.id_seller}
                  </h1>
                  <h1 className="text-2xl">
                    {saleFeatures.selectedSeller?.last_name}{" "}
                    {saleFeatures.selectedSeller?.name}
                  </h1>
                </>
              ) : (
                <h1 className="text-slate-700 text-2xl">asdasd</h1>
              )}
            </div>
          </div>
          <div className="flex flex-1 p-5">
            <div className="flex flex-1">
              <div className="flex flex-1 flex-col justify-start mt-5">
                <div className={styles.inpContainer}>
                  <p>quiniela</p>
                  <input
                    ref={quinielaRef}
                    disabled={!editMode}
                    type="number"
                    name="quiniela"
                    value={gamesFields.quiniela}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>quini 6</p>
                  <input
                    ref={quini6Ref}
                    disabled={!editMode}
                    type="number"
                    name="quini6"
                    value={gamesFields.quini6}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>loto</p>
                  <input
                    ref={lotoRef}
                    disabled={!editMode}
                    type="number"
                    name="loto"
                    value={gamesFields.loto}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>loto5</p>
                  <input
                    ref={loto5Ref}
                    disabled={!editMode}
                    type="number"
                    name="loto5"
                    value={gamesFields.loto5}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>brinco</p>
                  <input
                    ref={brincoRef}
                    disabled={!editMode}
                    type="number"
                    name="brinco"
                    value={gamesFields.brinco}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>poceada</p>
                  <input
                    ref={poceadaRef}
                    disabled={!editMode}
                    type="number"
                    name="poceada"
                    value={gamesFields.poceada}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>express</p>
                  <input
                    ref={expressRef}
                    disabled={!editMode}
                    type="number"
                    name="express"
                    value={gamesFields.express}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
              </div>
              <div className="flex flex-1 flex-col justify-starts mt-5">
                <div className={styles.inpContainer}>
                  <p>premios</p>
                  <input
                    ref={premiosRef}
                    disabled={!editMode}
                    type="number"
                    name="premios"
                    value={gamesFields.premios}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>total</p>
                  <input
                    disabled={!editMode}
                    type="number"
                    name="total"
                    value={gamesFields.total}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>paga</p>
                  <input
                    ref={pagaRef}
                    disabled={!editMode}
                    type="number"
                    name="paga"
                    value={gamesFields.paga}
                    onChange={(e) => handlerChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => handlerBlur(e)}
                    className={styles.gamesInp}
                  />
                </div>
                <div className={styles.inpContainer}>
                  <p>saldo</p>
                  <input
                    disabled={!editMode}
                    type="number"
                    className={`${styles.gamesInp} ${
                      parseFloat(gamesFields.saldo) > 0
                        ? "text-red-500"
                        : "text-green-500"
                    } bg-slate-600`}
                    name="saldo"
                    value={gamesFields.saldo}
                  />
                </div>
                <div className="w-full flex justify-end gap-3 px-10 mt-2">
                  <p className="text-xs text-slate-500">alquiler maquina</p>
                  <input
                    className="disabled:bg-blue-600 active:bg-red-600 checked:bg-green-500"
                    disabled={!editMode}
                    type="checkbox"
                    checked={gamesFields.machineRent}
                    onChange={() => {
                      setGamesFields({
                        ...gamesFields,
                        machineRent: !gamesFields.machineRent,
                      });
                    }}
                  />
                </div>

                <div className={`${styles.inpContainer} mt-5 flex-col gap-6`}>
                  <Button
                    ref={btnGuardarRef}
                    onClick={() => {
                      if (!!editMode) {
                        setDialogFrom("save");
                        if (!!verifyIfChanged()) {
                          return setShowDialog(true);
                        }
                        setEditMode(false);
                        return setTimeout(() => {
                          sellersLi[
                            !!saleFeatures.index ? saleFeatures.index : 0
                          ].click();
                        }, 100);
                      }
                      return;
                    }}
                    size="small"
                    variant="contained"
                    fullWidth
                  >
                    guardar
                  </Button>
                  <Button
                    ref={btnCancelRef}
                    onClick={() => {
                      if (!!editMode) {
                        setDialogFrom("cancel");
                        if (!!verifyIfChanged()) {
                          return setShowDialog(true);
                        }
                        setEditMode(false);
                        return setTimeout(() => {
                          sellersLi[
                            !!saleFeatures.index ? saleFeatures.index : 0
                          ].click();
                        }, 100);
                      }
                      return;
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                  >
                    cancelar
                  </Button>
                </div>
                <CustomDialog
                  setPressEnter={setPressEnter}
                  pressEnter={pressEnter}
                  title={
                    dialogFrom === "save"
                      ? "Desea guardar los cambios?"
                      : "Estas seguro de salir sin guardar?"
                  }
                  open={showDialog}
                  handleClose={() => setShowDialog(false)}
                  onCancel={() => {
                    setShowDialog(false);
                    setTimeout(() => {
                      quinielaRef.current?.focus();
                    }, 100);
                  }}
                  onConfirm={() => {
                    if (dialogFrom === "save") {
                      setEditMode(false);
                      setShowDialog(false);
                      return onSave();
                    }
                    if (dialogFrom === "cancel") {
                      setShowDialog(false);
                      setEditMode(false);
                      return setTimeout(() => {
                        sellersLi[
                          !!saleFeatures.index ? saleFeatures.index : 0
                        ].click();
                      }, 100);
                    }
                    setShowDialog(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SalesScreen;
