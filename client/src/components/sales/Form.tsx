import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { useSnackbar } from "notistack";
import { Sale, Seller } from "../../utils/interfaces";

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
type saleFeaturesType = {
  selectedSeller: Seller | null;
  sale: Sale[] | null;
};
type FormType = {
  date: string;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  saleFeatures: saleFeaturesType;
};
export const Form: React.FC<FormType> = ({
  date,
  editMode,
  setEditMode,
  saleFeatures,
}) => {
  const utils = trpc.useContext();
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [gamesFields, setGamesFields] = useState(initialGamesValues);
  const [saleId, setSaleId] = useState("");

  const [percents, setPercents] = useState({
    quiniela: saleFeatures.selectedSeller?.percent.quiniela,
    quini6: saleFeatures.selectedSeller?.percent.quini6,
    loto: saleFeatures.selectedSeller?.percent.loto,
    loto5: saleFeatures.selectedSeller?.percent.loto5,
    brinco: saleFeatures.selectedSeller?.percent.brinco,
    poceada: saleFeatures.selectedSeller?.percent.poceada,
    express: saleFeatures.selectedSeller?.percent.express,
  });

  const createSale = trpc.sale.createSale.useMutation();
  const updateSale = trpc.sale.updateSale.useMutation();

  useEffect(() => {
    if (!!saleFeatures.sale && saleFeatures.sale.length) {
      const { games, totals, _id } = saleFeatures.sale[0];
      setGamesFields({
        ...games,
        ...totals,
      });
      setSaleId(_id || "");
    } else {
      setGamesFields(initialGamesValues);
      setSaleId("");
    }
  }, [saleFeatures]);

  const convertVal: (num: string, percent?: string | undefined) => number = (
    num,
    percent = ""
  ) => {
    if (!!num) {
      if (percent) {
        const rawPercent = (parseFloat(num) * parseFloat(percent)) / 100;
        return parseFloat(num) - rawPercent;
      }
      return parseFloat(num);
    }
    return 0;
  };

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
      convertVal(quiniela, percents.quiniela) +
      convertVal(quini6, percents.quini6) +
      convertVal(loto, percents.loto) +
      convertVal(loto5, percents.loto5) +
      convertVal(brinco, percents.brinco) +
      convertVal(poceada, percents.poceada) +
      convertVal(express, percents.express);

    const machineRentPrice =
      saleFeatures?.selectedSeller?.percent?.machineRent || "0";

    const total = machineRent
      ? (sumTotal + convertVal(machineRentPrice)).toFixed(2)
      : sumTotal.toFixed(2);
    const saldo = (
      parseFloat(total) -
      convertVal(premios) -
      convertVal(paga)
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

    if (saleId) {
      return updateSale.mutate(
        { id: saleId, games, totals, status },
        {
          onSuccess: () => {
            queryClient.invalidateQueries();
            enqueueSnackbar("Sale successfully updated", {
              variant: "success",
            });
            setSaleId("");
            setEditMode(false);
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
          queryClient.invalidateQueries();
          enqueueSnackbar("Sale successfully created", {
            variant: "success",
          });
          setEditMode(false);
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

  return (
    <>
      <div className="w-full bg-slate-800 py-2 flex-row flex">
        <h1 className="text-2xl mx-5">
          {saleFeatures.selectedSeller?.id_seller}
        </h1>
        <h1 className="text-2xl mx-2">|</h1>
        <h1 className="text-2xl ml-5">
          {saleFeatures.selectedSeller?.last_name}{" "}
          {saleFeatures.selectedSeller?.name}
        </h1>
      </div>
      <div className="flex flex-1 bg-slate-700 py-8 px-5">
        <div className="flex flex-col  flex-1">
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>quiniela</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="quiniela"
                value={gamesFields.quiniela}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.quiniela}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>quini6</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="quini6"
                value={gamesFields.quini6}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.quini6}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>loto</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="loto"
                value={gamesFields.loto}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.loto}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>loto5</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="loto5"
                value={gamesFields.loto5}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.loto5}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>brinco</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="brinco"
                value={gamesFields.brinco}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.brinco}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>poceada</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="poceada"
                value={gamesFields.poceada}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.poceada}%
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>express</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="express"
                value={gamesFields.express}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
              <div className="bg-black flex justify-center items-center max-h-max">
                <p className="w-14 text-center text-xs" defaultValue={"15%"}>
                  {saleFeatures.selectedSeller?.percent.express}%
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col  flex-1 ">
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>premios</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="premios"
                value={gamesFields.premios}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>total</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-white bg-slate-600 pl-1 ml-1 w-3/5"
                name="total"
                value={gamesFields.total}
              />
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>paga</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className="text-black pl-1 ml-1 w-3/5"
                name="paga"
                value={gamesFields.paga}
                onChange={(e) => handlerChange(e)}
                onFocus={(e) => e.target.select()}
                onBlur={(e) => handlerBlur(e)}
              />
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="w-1/5 ">
              <p>saldo</p>
            </div>
            <div className="flex flex-row ">
              <input
                disabled={!editMode}
                type="number"
                className={`${
                  parseFloat(gamesFields.saldo) > 0
                    ? "text-red-500"
                    : "text-green-500"
                } bg-slate-600 pl-1 ml-1 w-3/5`}
                name="saldo"
                value={gamesFields.saldo}
              />
            </div>
          </div>
          <div className="flex flex-row py-3 items-center justify-center">
            <div className="mr-3 ">
              <p>alquiler maquina</p>
            </div>
            <div className="flex flex-row ">
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
          </div>

          <div className="mt-8 justify-center flex px-10 flex-col gap-5">
            <button
              className="py-2 text-md rounded-3xl bg-green-600 flex-1"
              onClick={() => {
                onSave();
              }}
            >
              Guardar
            </button>
            <button
              className="py-2 text-md rounded-3xl bg-red-600 flex-1"
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
