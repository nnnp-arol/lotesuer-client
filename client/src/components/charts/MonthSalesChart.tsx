import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { ApexOptions } from "apexcharts";

type queryDataType = {
  date: string;
  paga: number;
  premios: number;
  saldo: number;
  total: number;
};

export const MonthSalesChart: (props: {
  queryData: queryDataType[] | undefined;
}) => JSX.Element = ({ queryData }) => {
  const options: ApexOptions = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      x: {
        show: true,
      },
      y: {
        formatter: (value) => {
          return `$ ${value}`;
        },
        title: {
          formatter: () => "saldo total:",
        },
      },
      // z: {
      //   show: true,
      // },
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: undefined,
        // color: "black",
        // background: "#f5f5f5",
      },
    },
    markers: {
      size: 5,
    },
    title: {
      // text: "Ventas del mes",
      align: "left",
    },
    xaxis: {
      categories: queryData?.map((item) => {
        return `${moment(item.date).format("DD")}`;
      }),
    },
    // yaxis: {
    //   show: false,
    //   categories: queryData?.map((item) => {
    //     return `${item.date}`;
    //   }),
    // },
  };
  const series = queryData
    ? [
        {
          data: queryData.map((item) => {
            return item.saldo;
          }),
        },
      ]
    : [];

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="line"
      width={800}
      height={320}
    />
  );
};
