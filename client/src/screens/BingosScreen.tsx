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

const selectedSaleInitialice = {
  deliver_date: "",
  contest_number: "",
  delivered_cards: "",
  returned_cards: "",
  sold: "",
  balance: "",
};

export const BingosScreen = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedSale, setSelectedSale] = useState<BingoSale>(
    selectedSaleInitialice
  );
  const [gameSelected, setGameSelected] = useState<string | undefined>("");
  const [bingoSelected, setBingoSelected] = useState<Bingo | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newBingo, setNewBingo] = useState({
    contest_number: "",
    price: "",
    cards: "",
    dealt_cards: "",
    contest_date: "",
    returned_cards: "",
    game: "",
  });
  const precio = useRef<HTMLInputElement | null>(null);

  const { data }: UseQueryResult<Seller[] | undefined> =
    trpc.seller.get.useQuery();

  const { data: incomingBingos }: UseQueryResult<Bingo[] | undefined> =
    trpc.bingo.get.useQuery(
      {
        game: !!gameSelected ? gameSelected : "",
      },
      {
        enabled: !!gameSelected,
      }
    );

  const createBingo = trpc.bingo.create.useMutation();
  const createBingoSale = trpc.bingoSale.createBingoSale.useMutation();
  const { data: matchSales }: UseQueryResult<BingoSale[] | undefined> =
    trpc.bingoSale.getSaleByGameAndContest.useQuery({
      contest_number: !!bingoSelected?.contest_number
        ? bingoSelected?.contest_number
        : "",
      game: !!gameSelected ? gameSelected : "",
    });

  const utils = trpc.useContext();

  const handleChangeBingo = (e: any) => {
    setNewBingo({ ...newBingo, [e.target.name]: e.target.value });
  };

  useLayoutEffect(() => {
    const { current } = precio;

    current?.addEventListener("keydown", (e) => {
      console.log(e.keyCode);
    });
  }, []);

  useEffect(() => {
    if (editMode) {
      precio?.current ? precio.current.focus() : null;
    }
  }, [editMode]);

  const RenderStatus: (props: {
    id: string | undefined;
  }) => ReactJSXElement = ({ id }) => {
    const ownSale = matchSales?.find((item: any) => item.seller === id);
    if (ownSale) {
      if (parseInt(ownSale.balance) > 0) {
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

  return (
    <div className="h-full flex overflow-y-scroll no-scrollbar px-10 flex-col">
      <div className="w-full flex py-5 justify-between bg-slate-700">
        <div className="flex flex-1 flex-col gap-5">
          <div className="w-full bg-slate-500 gap-5 flex">
            <button
              className={
                gameSelected !== "telebingo"
                  ? styles.gamesBtn.inactive
                  : styles.gamesBtn.active
              }
              name="telebingo"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Telebingo
            </button>
            <button
              className={
                gameSelected !== "telekino"
                  ? styles.gamesBtn.inactive
                  : styles.gamesBtn.active
              }
              name="telekino"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Telekino
            </button>
            <button
              className={
                gameSelected !== "super15"
                  ? styles.gamesBtn.inactive
                  : styles.gamesBtn.active
              }
              name="super15"
              onClick={(e) => {
                setGameSelected(e.currentTarget.name);
                setBingoSelected(null);
              }}
            >
              Super 15
            </button>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">sorteo</p>
            <select
              className="w-28 text-black"
              defaultValue="seleccionar"
              onChange={(e) => {
                setBingoSelected(JSON.parse(e.target.value));
              }}
              onClick={(e) => {
                setBingoSelected(JSON.parse(e.currentTarget.value));
              }}
            >
              {!!incomingBingos
                ? incomingBingos.map((item) => (
                    <option value={JSON.stringify(item)} key={item._id}>
                      {item.contest_number}
                    </option>
                  ))
                : null}
            </select>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">precio</p>
            <input
              ref={precio}
              disabled={!editMode}
              type="text"
              value={bingoSelected ? bingoSelected?.price : ""}
              className="text-black w-28"
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones ingresados</p>
            <input
              disabled
              readOnly
              type="text"
              value={bingoSelected ? bingoSelected?.cards : ""}
              className="text-black w-28"
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones repartidos</p>
            <input
              disabled
              readOnly
              type="text"
              value={bingoSelected ? bingoSelected?.dealt_cards : ""}
              className="text-black w-28"
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cartones restantes</p>
            <input
              disabled
              readOnly
              type="text"
              value={bingoSelected ? bingoSelected?.returned_cards : ""}
              className="text-black w-28"
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">fecha sorteo</p>
            <input
              disabled
              readOnly
              type="date"
              value={bingoSelected ? bingoSelected?.contest_date : ""}
              className="text-black w-28"
            />
          </div>
          <div className="w-full flex flex-row  mt-10 justify-between px-5">
            <Button
              size="small"
              variant="outlined"
              className="gap-2"
              onClick={() => {
                if (!!gameSelected) {
                  setNewBingo({ ...newBingo, game: gameSelected });
                  return setShowModal(true);
                }
                alert("debes seleccionar un juego");
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
                setEditMode(true);
                precio?.current?.focus();
              }}
            >
              <EditOutlinedIcon color="inherit" />
              editar sorteo
            </Button>
          </div>
        </div>
        <div className="flex flex-1 bg-slate-800 flex-col gap-5">
          <div className="w-full bg-slate-500 justify-center items-center flex h-10">
            <h1>Vendedores</h1>
          </div>
          <div className="flex w-full">
            <ul className="flex flex-col w-full">
              {data &&
                data.map((item: any) => (
                  <li
                    className={`w-full justify-center items-center flex py-1 px-5 ${
                      selectedSeller?._id === item._id ? "bg-slate-900" : null
                    }`}
                    key={item._id}
                    onClick={() => {
                      const matchedSale = matchSales?.filter(
                        (sale) => sale.seller === item._id
                      )[0];
                      if (!!matchedSale) {
                        const {
                          balance,
                          contest_number,
                          delivered_cards,
                          returned_cards,
                          sold,
                        } = matchedSale;
                        setSelectedSale({
                          balance: !!balance ? balance : "0",
                          contest_number: !!contest_number
                            ? contest_number
                            : "0",
                          delivered_cards: !!delivered_cards
                            ? delivered_cards
                            : "0",
                          returned_cards: !!returned_cards
                            ? returned_cards
                            : "0",
                          sold: !!sold ? sold : "0",
                        });
                      } else {
                        setSelectedSale(selectedSaleInitialice);
                      }

                      setSelectedSeller(item);
                    }}
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
                    <RenderStatus id={item._id} />
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-5 flex-1">
          <div className="w-full bg-slate-500 justify-between items-center flex h-10 px-5">
            <h1 className="text-center">
              {`${selectedSeller?.id_seller || ""} `}
              {`${selectedSeller?.name || ""} ${
                selectedSeller?.last_name || ""
              }`}
            </h1>
            <button className="rounded-full w-6 h-6  border-white bg-blue-500 items-center justify-center flex hover:opacity-60">
              <EditOutlinedIcon
                color="inherit"
                sx={{ width: 15, height: 15 }}
              />
            </button>
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">cantidad</p>
            <input
              type="text"
              value={selectedSale.delivered_cards}
              className="text-black w-28"
              disabled
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">vendio</p>
            <input
              type="text"
              value={selectedSale.sold}
              className="text-black w-28"
              disabled
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">devuelve</p>
            <input
              type="text"
              value={selectedSale.returned_cards}
              className="text-black w-28"
              disabled
            />
          </div>

          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">paga</p>
            <input
              type="text"
              value={selectedSale.balance}
              className="text-black w-28"
              disabled
            />
          </div>
          <div className="flex flex-row justify-between items-center px-10 ">
            <p className="text-left text-white">saldo</p>
            <input
              type="text"
              value={selectedSale.balance}
              className="text-black w-28"
              disabled
            />
          </div>
          <div className="w-full flex justify-center items-center px-16 mt-10">
            <Button
              variant="contained"
              fullWidth
              // className="py-2 text-md rounded-3xl bg-green-600 flex-1 w-56"
              onClick={() => {
                createBingoSale.mutate(
                  {
                    balance: "234",
                    bingo: bingoSelected?._id ? bingoSelected?._id : "",
                    contest_number: bingoSelected?.contest_number
                      ? bingoSelected?.contest_number
                      : "",
                    deliver_date: "23/03/23",
                    delivered_cards: "234",
                    game: gameSelected || "",
                    returned_cards: "234",
                    seller: selectedSeller?._id ? selectedSeller?._id : "",
                    sold: "234",
                  },
                  {
                    onSuccess: () =>
                      enqueueSnackbar("venta registrada correctamente", {
                        variant: "success",
                      }),
                    onError: (error) =>
                      enqueueSnackbar(error.message, {
                        variant: "error",
                      }),
                  }
                );
              }}
            >
              Guardar
            </Button>
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
      </div>
    </div>
  );
};

const styles = {
  gamesBtn: {
    active: "py-2 text-md text-amber-400 flex-1",
    inactive: "py-2 text-md text-slate-700 flex-1",
  },
};
