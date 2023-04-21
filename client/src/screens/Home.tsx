import moment from "moment";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { helperFunctions } from "../utils/helperFunctions";
import { UseQueryResult } from "@tanstack/react-query";
import { Sale, Seller } from "../utils/interfaces";
import ReactApexChart from "react-apexcharts";
import { MonthSalesChart } from "../components/charts/MonthSalesChart";
import { GamesChart } from "../components/charts/GamesChart";
import { DebtSellersChart } from "../components/charts/DebtSellersChart";

const getMonth = (month: string) => {
  switch (month) {
    case "1":
      return "Enero";
    case "2":
      return "Febrero";
    case "3":
      return "Marzo";
    case "4":
      return "Abril";
    case "5":
      return "Mayo";
    case "6":
      return "Junio";
    case "7":
      return "Julio";
    case "8":
      return "Agosto";
    case "9":
      return "Septiembre";
    case "10":
      return "Octubre";
    case "11":
      return "Noviembre";
    case "12":
      return "Diciembre";
  }
};

type SalesWithDebtType = {
  seller: Seller;
  debt: number;
};
type MonthSalesType = {
  date: string;
  paga: number;
  premios: number;
  saldo: number;
  total: number;
};

function Home({
  setSelectedRoute,
}: {
  setSelectedRoute: (val: string) => void;
}) {
  const [range] = useState({
    start: `${moment().format("YYYY")}-${moment().format("MM")}-01`,
    end: `${moment().format("YYYY")}-${moment().format(
      "MM"
    )}-${moment().daysInMonth()}`,
  });
  const [totals, setTotals] = useState({
    quiniela: 0,
    quini6: 0,
    loto: 0,
    loto5: 0,
    brinco: 0,
    poceada: 0,
    express: 0,
    ventaTotal: 0,
    premiosTotal: 0,
    ingresoTotal: 0,
    saldoTotal: 0,
    efectivoTotal: 0,
  });

  const { data }: UseQueryResult<Sale[] | undefined> =
    trpc.sale.getSaleByRange.useQuery({
      start: range.start,
      end: range.end,
      seller: "",
    });

  const {
    data: salesWithDebts,
  }: UseQueryResult<SalesWithDebtType[] | undefined> =
    trpc.sale.getSalesWithDebts.useQuery({
      start: range.start,
      end: range.end,
    });

  const { data: monthSales }: UseQueryResult<MonthSalesType[] | undefined> =
    trpc.sale.getAllMonthSales.useQuery({
      start: range.start,
      end: range.end,
    });

  useEffect(() => {
    // console.log(monthSales);
    if (data?.length) {
      const {
        ventaTotal,
        premiosTotal,
        ingresoTotal,
        saldoTotal,
        efectivoTotal,
      } = helperFunctions.totalAccumulator(data);
      setTotals({
        quiniela: ventaTotal.quiniela,
        quini6: ventaTotal.quini6,
        loto: ventaTotal.loto,
        loto5: ventaTotal.loto5,
        brinco: ventaTotal.brinco,
        poceada: ventaTotal.poceada,
        express: ventaTotal.express,
        ventaTotal:
          ventaTotal.quiniela +
          ventaTotal.loto +
          ventaTotal.quini6 +
          ventaTotal.loto5 +
          ventaTotal.brinco +
          ventaTotal.poceada +
          ventaTotal.express,
        premiosTotal,
        ingresoTotal,
        saldoTotal,
        efectivoTotal,
      });
    }
  }, [data]);

  setSelectedRoute("home");

  return (
    <div className="flex-1 flex-col h-full overflow-y-auto p-20">
      <div>
        <div className="flex flex-1 h-full flex-row gap-10">
          <div className="flex flex-1 flex-col items-center p-5 border rounded-xl gap-5">
            <h1 className="text-xl">
              Ventas diarias de {getMonth(moment().month().toString())}
            </h1>
            <MonthSalesChart queryData={monthSales} />
          </div>
          <div className="flex flex-1 flex-col max-w-lg overflow-hidden border rounded-xl gap-5 p-5">
            <h1 className="text-center text-xl">Juegos mas vendidos</h1>
            <GamesChart
              series={[
                totals.quiniela,
                totals.quini6,
                totals.loto,
                totals.loto5,
                totals.brinco,
                totals.poceada,
                totals.express,
              ]}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-row mt-10 gap-10">
          <div className="flex  flex-col overflow-hidden p-10 rounded-xl">
            {/* <DebtSellersChart queryData={salesWithDebts} /> */}
          </div>
          {/* <div className="flex flex-1 flex-col overflow-hidden p-10 max-w-lg "></div> */}
        </div>
      </div>
    </div>
  );
}

export default Home;
