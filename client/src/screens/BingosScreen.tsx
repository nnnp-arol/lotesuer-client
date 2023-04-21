import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Bingo, BingoSale, Seller } from "../utils/interfaces";
import { trpc } from "../utils/trpc";
import { UseQueryResult } from "@tanstack/react-query";
import { CustomDialog } from "../components/common/CustomDialog";
import Button from "@mui/material/Button";
import ArrowBackIosNewOutlinedIcon from "@mui/icons-material/ArrowBackIosNewOutlined";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { NewContest } from "../components/modal/NewContest";
import { useSnackbar } from "notistack";
import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import KeyboardDoubleArrowDownOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowDownOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { helperFunctions } from "../utils/helperFunctions";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";

const selectedSaleInitialice = {
  _id: "",
  sorteo: "",
  fecha_sorteo: "",
  juego: "",
  cartones: "0",
  devolucion: "0",
  paga: "0.00",
  saldo: "0.00",
};

export const BingosScreen = ({
  setSelectedRoute,
}: {
  setSelectedRoute: (val: string) => void;
}) => {
  const cartones2Ref = useRef<HTMLInputElement | null>(null);
  const devolucionRef = useRef<HTMLInputElement | null>(null);
  const pagaRef = useRef<HTMLInputElement | null>(null);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const btnGuardarRef = useRef<HTMLButtonElement | null>(null);
  const btnCancelRef = useRef<HTMLButtonElement | null>(null);
  const firstInputBingo = useRef<HTMLInputElement | null>(null);

  const { enqueueSnackbar } = useSnackbar();

  const [index, setIndex] = useState<number | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedSale, setSelectedSale] = useState<BingoSale>(
    selectedSaleInitialice
  );

  const [showSearch, setShowSearch] = useState(false);
  const [searchBy, setSearchBy] = useState("");

  const [gameSelected, setGameSelected] = useState<string | undefined>("");
  const [bingoSelected, setBingoSelected] = useState<Bingo | null>(null);
  const [editModeBingo, setEditModeBingo] = useState<boolean>(false);
  const [editModeSale, setEditModeSale] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [sellersLi, setSellersLi] = useState<any>([]);

  const [newBingo, setNewBingo] = useState({
    fecha_sorteo: "",
    sorteo: "",
    precio: "",
    juego: "",
    cartones: "",
  });

  const { data }: UseQueryResult<Seller[] | undefined> =
    trpc.seller.get.useQuery({ searchBy });

  const { data: incomingBingos }: UseQueryResult<Bingo[] | undefined> =
    trpc.bingo.get.useQuery(
      {
        juego: !!gameSelected ? gameSelected : "",
      },
      {
        enabled: !!gameSelected,
      }
    );

  const createBingo = trpc.bingo.create.useMutation();
  const deleteBingo = trpc.bingo.delete.useMutation();
  const createBingoSale = trpc.bingoSale.createBingoSale.useMutation();
  const updateBingoSale = trpc.bingoSale.updateBingoSale.useMutation();

  const { data: matchSales }: UseQueryResult<BingoSale[] | undefined> =
    trpc.bingoSale.getSaleByGameAndContest.useQuery({
      sorteo: !!bingoSelected?.sorteo ? bingoSelected?.sorteo : "",
      juego: !!gameSelected ? gameSelected : "",
    });

  const utils = trpc.useContext();

  const handleChangeBingo = (e: any) => {
    setNewBingo({ ...newBingo, [e.target.name]: e.target.value });
  };

  const handleChangeSale = (e: any) => {
    setSelectedSale({ ...selectedSale, [e.target.name]: e.target.value });
  };

  useLayoutEffect(() => {
    const lis = document.getElementById("sellersContainer")?.children;
    setSellersLi(Array.from(lis?.length ? lis : []));
  }, [data]);

  useLayoutEffect(() => {
    const fnc = (e: any) => {
      const lastIndex = sellersLi.length - 1;

      if (e.key === "ArrowDown") {
        if (!!editModeSale || !!editModeBingo || !!showSearch) {
          return;
        }
        if (index === null || lastIndex === index) {
          sellersLi[0].focus();
          sellersLi[0].scrollIntoView();
          return sellersLi[0].click();
        }
        if (index >= 0) {
          sellersLi[index + 1].click();
          sellersLi[index + 1].scrollIntoView();
          return sellersLi[index + 1].focus();
        }
      }
      if (e.key === "ArrowUp") {
        if (!!editModeSale || !!editModeBingo || !!showSearch) {
          return;
        }
        if (!index) {
          sellersLi[lastIndex].focus();
          sellersLi[lastIndex].scrollIntoView();
          return sellersLi[lastIndex].click();
        }
        if (index > 0) {
          sellersLi[index - 1].click();
          sellersLi[index - 1].scrollIntoView();
          return sellersLi[index - 1].focus();
        }
      }

      if (e.key === "Enter") {
        if (!!gameSelected) {
          // if (!!showDialog) {
          //   return setPressEnter(true);
          // }
          if (!!showSearch) {
            setShowSearch(false);
            sellersLi[0].click();
            return sellersLi[0].focus();
          }
          if (!!selectedSeller && !editModeSale) {
            setEditModeSale(true);
            return setTimeout(() => {
              cartones2Ref?.current?.focus();
            }, 100);
          }
          if (
            !!editModeSale &&
            !!selectedSeller &&
            !editModeBingo &&
            !showModal &&
            !showSearch
          ) {
            if (e?.target?.name === "cartones") {
              return devolucionRef?.current?.focus();
            }
            if (e?.target?.name === "devolucion") {
              return pagaRef?.current?.focus();
            }
            if (e?.target?.name === "paga") {
              return btnGuardarRef?.current?.click();
            }
          }
        }
      }

      if (e.key === "Escape") {
        if (!!editModeSale) {
          return btnCancelRef.current?.click();
        }
        if (!!showSearch) {
          setSearchBy("");
          return setShowSearch(false);
        }
        if (
          !editModeSale &&
          !editModeBingo &&
          !showSearch &&
          !showModal &&
          !!selectedSeller
        ) {
          setSearchBy("");
          setSelectedSale(selectedSaleInitialice);
          setSelectedSeller(null);
          return setIndex(null);
        }
        return;
      }

      if (e.key === "F1") {
        if (!editModeBingo && !editModeSale && !!gameSelected) {
          setShowSearch(true);
          return setTimeout(() => {
            searchRef.current?.focus();
          }, 200);
        }
        return;
      }
    };

    document.addEventListener("keydown", fnc);

    return () => {
      document.removeEventListener("keydown", fnc);
    };
  }, [
    gameSelected,
    editModeSale,
    editModeBingo,
    selectedSeller,
    showModal,
    showSearch,
  ]);

  useEffect(() => {
    const { convertVal } = helperFunctions;
    const { paga, devolucion, cartones } = selectedSale;

    const precio = convertVal(bingoSelected?.precio, "", false);
    const totalCartones =
      convertVal(cartones, "", false) - convertVal(devolucion, "", false);

    const total = totalCartones * precio;

    setSelectedSale({
      ...selectedSale,
      saldo: (total - convertVal(paga, "", false)).toFixed(2),
    });
  }, [selectedSale.devolucion, selectedSale.paga, selectedSale.cartones]);

  useEffect(() => {
    const foundSale = matchSales?.filter((item) => {
      return item.seller === selectedSeller?._id;
    });
    if (!!foundSale && !!foundSale.length) {
      return setSelectedSale(foundSale[0]);
    }
    return setSelectedSale(selectedSaleInitialice);
  }, [selectedSeller]);

  useEffect(() => {
    if (editModeBingo) {
      firstInputBingo?.current ? firstInputBingo.current.focus() : null;
    }
  }, [editModeBingo]);

  const RenderStatus: (props: {
    id: string | undefined;
  }) => ReactJSXElement = ({ id }) => {
    const ownSale = matchSales?.find((item: any) => item.seller === id);
    if (ownSale) {
      if (parseInt(ownSale.saldo) > 0) {
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

  setSelectedRoute("bingo");

  return (
    <div className="h-full flex overflow-y-scroll no-scrollbar px-5 flex-col">
      <div className="flex w-full py-2 justify-end mt-5">
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
      <div className="flex flex-1 flex-row  mt-5 ">
        <div className="flex w-1/3 flex-col gap-5 justify-start mr-5">
          <div className="flex justify-between items-center bg-slate-800 py-1 h-12 rounded-md">
            <Button
              variant="text"
              className="py-2 text-lg flex-1"
              color={gameSelected !== "telebingo" ? "inherit" : "primary"}
              name="telebingo"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Telebingo
            </Button>
            <Button
              className="py-2 text-lg flex-1"
              color={gameSelected !== "telekino" ? "inherit" : "primary"}
              name="telekino"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Telekino
            </Button>
            <Button
              className="py-2 text-lg flex-1"
              color={gameSelected !== "super15" ? "inherit" : "primary"}
              name="super15"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Super 15
            </Button>
          </div>
          <div className="flex flex-row justify-between items-center px-10 mt-5">
            <p className="text-left text-white">sorteo</p>
            <select
              className={styles.gamesInp}
              defaultValue="seleccionar sorteo"
              onChange={(e) => {
                if (!!e.currentTarget.value) {
                  return setBingoSelected(JSON.parse(e.target.value));
                }
              }}
              onClick={(e) => {
                if (!!e.currentTarget.value) {
                  return setBingoSelected(JSON.parse(e.currentTarget.value));
                }
              }}
            >
              {!!incomingBingos
                ? incomingBingos.map((item) => {
                    return (
                      <option value={JSON.stringify(item)} key={item._id}>
                        {item.sorteo}
                      </option>
                    );
                  })
                : null}
            </select>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">fecha sorteo</p>
            <input
              disabled
              readOnly
              type="date"
              value={bingoSelected ? bingoSelected?.fecha_sorteo : ""}
              className={styles.gamesInp}
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">precio</p>
            <input
              ref={firstInputBingo}
              disabled={!editModeBingo}
              type="text"
              value={bingoSelected ? bingoSelected?.precio : ""}
              className={styles.gamesInp}
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones</p>
            <input
              disabled
              readOnly
              type="text"
              value={bingoSelected ? bingoSelected?.cartones : ""}
              className={styles.gamesInp}
            />
          </div>
          <div className="w-full flex flex-col gap-5 mt-5 justify-between px-10">
            <Button
              size="small"
              variant="contained"
              className="gap-2"
              onClick={() => {
                if (!!gameSelected) {
                  setNewBingo({ ...newBingo, juego: gameSelected });
                  return setShowModal(true);
                }
                enqueueSnackbar("Tienes que seleccionar un juego", {
                  variant: "info",
                });
              }}
            >
              <AddCircleOutlineIcon color="inherit" />
              nuevo sorteo
            </Button>
            <Button
              size="small"
              variant="outlined"
              className="gap-2"
              onClick={() => {
                setEditModeBingo(true);
                firstInputBingo?.current?.focus();
              }}
            >
              <EditOutlinedIcon color="inherit" />
              editar sorteo
            </Button>
            <Button
              size="small"
              variant="outlined"
              className="gap-2"
              onClick={() => {
                // if (!!bingoSelected && !!bingoSelected._id) {
                //   return deleteBingo.mutate(
                //     { id: bingoSelected._id },
                //     {
                //       onSuccess: () => {
                //         enqueueSnackbar("Sorteo eliminado correctamente", {
                //           variant: "success",
                //         });
                //         utils.invalidate();
                //       },
                //       onError: (error) =>
                //         enqueueSnackbar(error.message, {
                //           variant: "error",
                //         }),
                //     }
                //   );
                // }
              }}
            >
              <DeleteOutlineOutlinedIcon color="inherit" />
              eliminar sorteo
            </Button>
          </div>
        </div>
        <div className="flex flex-1 items-center flex-col border-b-4 border-blue-500 h-5/6">
          <div className="w-full flex justify-center py-2 bg-slate-700 px-2 rounded-md">
            <div className="flex flex-1 justify-start items-center pl-5 gap-2 ">
              <div className="w-2 h-2 rounded-full bg-slate-400 "></div>
              <h1 className="text-2xl text-slate-400">vendedores</h1>
            </div>
            <div className="flex flex-1 justify-end items-center gap-1">
              <Button
                size="small"
                onClick={() => {
                  setShowSearch(!showSearch);
                }}
              >
                <SearchIcon />
              </Button>
              {showSearch && (
                <input
                  type="text"
                  placeholder="buscar"
                  className="rounded-md px-2 py-1 text-white bg-slate-800 w-full"
                  onChange={(e) => setSearchBy(e.target.value)}
                  onBlur={() => setShowSearch(false)}
                  value={searchBy}
                  ref={searchRef}
                />
              )}
            </div>
          </div>
          <div className="w-full flex pb-2 px-1 border-b-4 border-blue-500 py-4">
            <h1 className="basis-20 ">num</h1>
            <h1 className="flex flex-1">vendedor</h1>
            <h1 className="basis-20">estado</h1>
          </div>
          <div
            className="w-full flex flex-col overflow-y-scroll no-scrollbar text-slate-500"
            id="sellersContainer"
          >
            {data?.map((s: any, inx: number) => {
              return (
                <div
                  className={`hover:cursor-pointer ${
                    inx === data?.length - 1 ? "" : "border-b border-blue-600"
                  } w-full flex py-2 px-1 ${
                    selectedSeller?._id === s._id
                      ? "bg-blue-800 text-white"
                      : ""
                  }`}
                  onClick={() => {
                    if (!bingoSelected) {
                      return;
                    }
                    setSelectedSeller(s);
                    setIndex(inx);
                  }}
                  onDoubleClick={() => {
                    if (!!editModeSale || !bingoSelected) {
                      return;
                    }
                    setEditModeSale(true);
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

        <div className="flex flex-col gap-5 flex-1 rounded-xl bg-slate-900 ml-5">
          <div className="flex flex-row px-5 bg-slate-700 rounded-md ">
            <div className="flex flex-1 justify-start items-center gap-3 py-2">
              <div className="w-2 h-2 rounded-full bg-slate-400"></div>
              {!!selectedSeller ? (
                <>
                  <h1 className="text-2xl text-slate-500">
                    {selectedSeller?.id_seller}
                  </h1>
                  <h1 className="text-2xl">
                    {selectedSeller?.last_name} {selectedSeller?.name}
                  </h1>
                </>
              ) : (
                <h1 className="text-slate-700 text-2xl">asdasd</h1>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between items-center px-10">
            <p className="text-left text-white">cartones</p>
            <input
              onFocus={(e) => e.target.select()}
              ref={cartones2Ref}
              type="text"
              value={selectedSale?.cartones}
              className={styles.gamesInp}
              disabled={!editModeSale}
              name="cartones"
              onChange={(e) => handleChangeSale(e)}
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">devolucion</p>
            <input
              ref={devolucionRef}
              onFocus={(e) => e.target.select()}
              type="text"
              value={selectedSale?.devolucion}
              className={styles.gamesInp}
              disabled={!editModeSale}
              onChange={(e) => handleChangeSale(e)}
              name="devolucion"
            />
          </div>

          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">paga</p>
            <input
              ref={pagaRef}
              onFocus={(e) => e.target.select()}
              type="text"
              value={selectedSale?.paga}
              className={styles.gamesInp}
              disabled={!editModeSale}
              onChange={(e) => handleChangeSale(e)}
              name="paga"
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">saldo</p>
            <input
              onFocus={(e) => e.target.select()}
              type="text"
              value={selectedSale?.saldo}
              className={`text-black rounded-sm bg-slate-400 pl-1 disabled:opacity-50 w-36 ${
                parseFloat(selectedSale.saldo) > 0
                  ? "text-red-500"
                  : "text-green-500"
              } bg-slate-600`}
              disabled={!editModeSale}
              onChange={(e) => handleChangeSale(e)}
              name="saldo"
            />
          </div>
          <div className="w-full flex justify-center items-center px-12 mt-10 flex-col gap-5">
            <Button
              ref={btnGuardarRef}
              variant="contained"
              fullWidth
              onClick={() => {
                if (!!editModeSale) {
                  if (!!selectedSale?._id) {
                    return updateBingoSale.mutate(
                      {
                        id: !!selectedSale._id
                          ? selectedSale._id.toString()
                          : "",
                        cartones: selectedSale.cartones,
                        devolucion: selectedSale.devolucion,
                        paga: selectedSale.paga,
                        saldo: selectedSale.saldo,
                      },
                      {
                        onSuccess: () => {
                          enqueueSnackbar("venta actualizada correctamente", {
                            variant: "success",
                          });
                          utils.invalidate();
                          setEditModeSale(false);
                        },
                        onError: (error) =>
                          enqueueSnackbar(error.message, {
                            variant: "error",
                          }),
                      }
                    );
                  }
                  const obj = {
                    bingo: !!bingoSelected?._id ? bingoSelected._id : "",
                    seller: !!selectedSeller?._id ? selectedSeller._id : "",
                    sorteo: !!bingoSelected?.sorteo ? bingoSelected.sorteo : "",
                    fecha_sorteo: !!bingoSelected?.fecha_sorteo
                      ? bingoSelected.fecha_sorteo
                      : "",
                    juego: gameSelected || "",
                    cartones: "2000",
                    devolucion: selectedSale.devolucion,
                    paga: selectedSale.paga,
                    saldo: selectedSale.saldo,
                  };
                  return createBingoSale.mutate(obj, {
                    onSuccess: () => {
                      enqueueSnackbar("venta registrada correctamente", {
                        variant: "success",
                      });
                      utils.invalidate();
                      setEditModeSale(false);
                    },
                    onError: (error) =>
                      enqueueSnackbar(error.message, {
                        variant: "error",
                      }),
                  });
                }
                return;
              }}
            >
              Guardar
            </Button>
            <Button
              ref={btnCancelRef}
              variant="outlined"
              fullWidth
              onClick={() => setEditModeSale(false)}
            >
              Cancelar
            </Button>
          </div>
        </div>
        <CustomDialog
          open={showModal}
          title="Nuevo Sorteo"
          onCancel={() => setShowModal(false)}
          handleClose={() => setShowModal(false)}
          onConfirm={() => {
            return createBingo.mutate(newBingo, {
              onSuccess: () => {
                enqueueSnackbar("sorteo registrado correctamente", {
                  variant: "success",
                });
                setShowModal(false);
                utils.invalidate();
              },
              onError: (error) => {
                enqueueSnackbar(error.message, {
                  variant: "error",
                });
              },
            });
          }}
          bodyContent={
            <NewContest
              game={!!gameSelected ? gameSelected : ""}
              handleChange={handleChangeBingo}
            />
          }
        />
      </div>
    </div>
  );
};

const styles = {
  gamesInp: "text-black rounded-sm bg-slate-400 pl-1 disabled:opacity-50 w-36",
  gamesBtn: {
    active: "py-2 text-lg text-slate-300 flex-1",
    inactive: "py-2 text-lg text-slate-500 flex-1",
  },
};
