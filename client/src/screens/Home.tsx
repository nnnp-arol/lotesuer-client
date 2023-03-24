import moment from "moment";
import { useEffect, useState } from "react";
import { trpc } from "../utils/trpc";
import { helperFunctions } from "../utils/helperFunctions";
import { UseQueryResult } from "@tanstack/react-query";
import { Sale } from "../utils/interfaces";
import ReactApexChart from "react-apexcharts";
import { MonthSalesChart } from "../components/charts/MonthSalesChart";
import { GamesChart } from "../components/charts/GamesChart";
import { DebtSellersChart } from "../components/charts/DebtSellersChart";

function Home() {
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

  const { data: salesWithDebts }: UseQueryResult<Sale[] | undefined> =
    trpc.sale.getSalesWithDebts.useQuery({
      start: range.start,
      end: range.end,
    });

  const { data: monthSales }: UseQueryResult<Sale[] | undefined> =
    trpc.sale.getAllMonthSales.useQuery({
      start: range.start,
      end: range.end,
    });

  useEffect(() => {
    console.log(salesWithDebts);
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

  return (
    <div className="flex-1 flex-col h-full overflow-y-auto p-20">
      <div>
        <div className="flex flex-1 h-full flex-row">
          <div className="flex flex-1 max-w-lg overflow-hidden">
            <div className="flex flex-1 flex-col items-center p-10">
              <MonthSalesChart queryData={monthSales} />
            </div>
          </div>
          <div className="flex flex-1 flex-col max-w-lg overflow-hidden ">
            <h1 className="text-center text-2xl">Juegos mas vendidos</h1>
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
        <div className="flex flex-1 flex-row">
          <div className="flex flex-1 flex-col max-w-lg overflow-hidden p-10">
            <DebtSellersChart queryData={salesWithDebts} />
          </div>
          <div className="flex flex-1 flex-col max-w-lg overflow-hidden p-10"></div>
        </div>
      </div>
    </div>
  );
}

export default Home;
