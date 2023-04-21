import { Sale } from "./interfaces";

type gamesValuesAccumulatorType = (arr: Sale[]) => {
  quiniela: number;
  quini6: number;
  loto: number;
  loto5: number;
  brinco: number;
  poceada: number;
  express: number;
};
type totalsReturnedObjectType = {
  ingresoTotal: number;
  ventaTotal: ventaTotal;
  saldoTotal: number;
  premiosTotal: number;
  efectivoTotal: number;
};
type ventaTotal = {
  quiniela: number;
  quini6: number;
  loto: number;
  loto5: number;
  brinco: number;
  poceada: number;
  express: number;
};

const totalAccumulator: (arr: Sale[]) => totalsReturnedObjectType = (arr) => {
  const ingresoTotal = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.totals.total);
  }, 0);
  const efectivoTotal = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.totals.paga);
  }, 0);
  const ventaTotal = gamesValuesAccumulator(arr);
  const saldoTotal = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.totals.saldo);
  }, 0);
  const premiosTotal = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.totals.premios);
  }, 0);
  return { ingresoTotal, ventaTotal, saldoTotal, premiosTotal, efectivoTotal };
};

const gamesValuesAccumulator: gamesValuesAccumulatorType = (arr) => {
  const quiniela = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.quiniela);
  }, 0);
  const quini6 = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.quini6);
  }, 0);
  const loto = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.loto);
  }, 0);
  const loto5 = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.loto5);
  }, 0);
  const brinco = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.brinco);
  }, 0);
  const poceada = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.poceada);
  }, 0);
  const express = arr.reduce(function (acc: number, obj: Sale) {
    return acc + parseFloat(obj.games.express);
  }, 0);
  return { quiniela, quini6, loto, loto5, brinco, poceada, express };
};

const convertVal: (
  num: string | undefined,
  percent?: string | undefined,
  isFloat?: boolean | undefined
) => number = (num, percent = "", isFloat = true) => {
  if (!!num) {
    if (isFloat) {
      if (!!percent) {
        const rawPercent = (parseFloat(num) * parseFloat(percent)) / 100;
        return parseFloat(num) - rawPercent;
      }
      return parseFloat(num);
    } else {
      if (!!percent) {
        const rawPercent = (parseInt(num) * parseInt(percent)) / 100;
        return parseInt(num) - rawPercent;
      }
      return parseInt(num);
    }
  }
  return 0;
};

export const helperFunctions = {
  totalAccumulator,
  gamesValuesAccumulator,
  convertVal,
};
