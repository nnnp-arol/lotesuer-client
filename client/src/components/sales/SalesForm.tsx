import React, { useEffect, useRef, useState } from "react";
import { GamesFields, Seller } from "../../utils/interfaces";
import { trpc } from "../../utils/trpc";

const initialGamesState = {
  quiniela: "0",
  quini6: "0",
  loto: "0",
  loto5: "0",
  brinco: "0",
  poceada: "0",
  express: "0",
  premios: "0",
  total: "0",
  paga: "0",
  saldo: "0",
};

type SalesFormType = {
  fields: GamesFields;
  setFields: (value: string) => void;
  convertVal: (num: string) => number;
  date: string;
  seller: Seller | null;
};

export const SalesForm: React.FC<SalesFormType> = ({
  fields,
  setFields,
  convertVal,
  date,
  seller,
}) => {
  const inpTestRef = useRef(null);
  const addSale = trpc.sale.createSale.useMutation();
  const utils = trpc.useContext();

  const handlerSubmit = () => {
    const fieldsValues = fields;
    const data = {
      date,
      seller: seller?._id,
      ...fieldsValues,
    };
    addSale.mutate(data, {
      onSuccess: () => {},
      onError: (error) => console.log(error),
    });
  };

  const handlerChange = (e: any) => {
    setFields({ ...fields, [e.target.name]: e.currentTarget.value });
  };

  const handlerFocus = (e: any) => {
    e.currentTarget.select();
  };

  const handlerBlur = (e: any) => {
    const targetValue = convertVal(e.currentTarget.value);
    if (
      !targetValue ||
      targetValue.toString() === "0" ||
      targetValue.toString() === "0.0"
    ) {
      return setFields({ ...fields, [e.target.name]: "0.0" });
    }
    const convert = parseFloat(e.currentTarget.value).toFixed(1);
    setFields({ ...fields, [e.target.name]: convert });
  };

  const getSaleBySeller = trpc.sale.getSaleBySeller.useQuery({
    date,
    seller: seller?._id,
  });

  useEffect(() => {
    const data = getSaleBySeller?.data ? getSaleBySeller?.data[0] : null;
    if (!!data) {
      return setFields({
        quiniela: data.quiniela,
        quini6: data.quini6,
        loto: data.loto,
        loto5: data.loto5,
        brinco: data.brinco,
        poceada: data.poceada,
        express: data.express,
        premios: data.premios,
        total: data.total,
        paga: data.paga,
        saldo: data.saldo,
      });
    }
    setFields(initialGamesState);
  }, [date, seller]);

  return <div className="flex-row flex flex-1 rounded-3xl "></div>;
};

const styles = {
  liTextDisabled: "text-white",
  liTextEnabled: "text-black",
  liDisabled: "bg-slate-500 flex-1 flex-row flex ",
  liEnabled: "bg-slate-300 flex-1 flex-row flex ",
  gamesInputs: "text-black text-left",
};

{
  /* <div className="basis-1/2 bg-slate-900 flex justify-start items-center flex-col">
        <div className="my-2 flex flex-col">
          <p>quiniela</p>
          <input
            ref={inpTestRef}
            className={`${styles.gamesInputs}`}
            type="number"
            name="quiniela"
            value={fields.quiniela}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>quini6</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="quini6"
            value={fields.quini6}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>loto</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="loto"
            value={fields.loto}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>loto5</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="loto5"
            value={fields.loto5}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>brinco</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="brinco"
            value={fields.brinco}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>poceada</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="poceada"
            value={fields.poceada}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>express</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="express"
            value={fields.express}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
      </div>
      <div className="flex-1 bg-slate-900 flex justify-start items-center flex-col">
        <div className="my-2">
          <p>premios</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="premios"
            value={fields.premios}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>total</p>
          <input
            disabled
            className={
              parseInt(fields.saldo) < 0
                ? "text-red-600 text-center"
                : "text-green-500 text-center"
            }
            type="number"
            name="total"
            value={fields.total}
          />
        </div>
        <div className="my-2">
          <p>paga</p>
          <input
            className={styles.gamesInputs}
            type="number"
            name="paga"
            value={fields.paga}
            onChange={(e) => handlerChange(e)}
            onFocus={(e) => handlerFocus(e)}
            onBlur={(e) => handlerBlur(e)}
          />
        </div>
        <div className="my-2">
          <p>saldo</p>
          <input
            disabled
            className={
              parseInt(fields.saldo) < 0
                ? "text-red-600 text-center"
                : "text-green-500 text-center"
            }
            type="number"
            name="saldo"
            value={fields.saldo}
            onChange={(e) => handlerChange(e)}
          />
        </div>
        <div>
          <button onClick={handlerSubmit}>guardar</button>
        </div>
      </div> */
}
