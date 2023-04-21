import { Button } from "@mui/material";
import { UseQueryResult, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
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
  sale: Sale[] | [];
  index: number | null;
};
type SalesFormType = {
  date: string;
  editMode: boolean;
  setEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  saleFeatures: saleFeaturesType;
  onCancel: () => void;
};

const styles = {
  inpContainer: "flex w-full flex-row justify-between py-3 px-10",
  gamesInp: "text-black rounded-sm bg-slate-400 pl-1 disabled:opacity-50",
};

export const SalesForm: React.FC<SalesFormType> = ({
  date,
  editMode,
  setEditMode,
  saleFeatures,
  onCancel,
}) => {
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

  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const [gamesFields, setGamesFields] = useState(initialGamesValues);
  const [saleId, setSaleId] = useState<string | undefined>("");

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

  useLayoutEffect(() => {
    const changeFocus = (e: any) => {
      if (!editMode) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      if (e.key === "Enter") {
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
      }
      return;
    };
    document.addEventListener("keypress", changeFocus);

    return () => document.removeEventListener("keypress", changeFocus);
  }, [editMode]);

  useEffect(() => {
    if (!!saleFeatures.sale && !!saleFeatures.sale.length) {
      const { games, totals, _id } = saleFeatures.sale[0];
      setGamesFields({
        ...games,
        ...totals,
      });
      setSaleId(_id);
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

  useEffect(() => {
    if (editMode) {
      setTimeout(() => {
        quinielaRef?.current?.focus();
      }, 200);
    }
  }, [editMode]);

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

    if (!!saleId) {
      return updateSale.mutate(
        { id: saleId, games, totals, status },
        {
          onSuccess: () => {
            enqueueSnackbar("Venta actualizada correctamente", {
              variant: "success",
            });
            // setSaleId("");
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

  return (
    <>
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
              onSave();
            }}
            size="small"
            variant="contained"
            fullWidth
          >
            guardar
          </Button>
          <Button onClick={onCancel} size="small" variant="outlined" fullWidth>
            cancelar
          </Button>
        </div>

        <div className={`${styles.inpContainer} mt-5`}></div>
      </div>
    </>
  );
};
