import ReactApexChart from "react-apexcharts";
import moment from "moment";

export const MonthSalesChart = ({ queryData }) => {
  const chart = {
    options: {
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
        z: {
          show: true,
        },
        enabled: true,
        theme: "dark",
        style: {
          fontSize: "12px",
          fontFamily: undefined,
          color: "black",
          background: "#f5f5f5",
        },
      },
      markers: {
        size: 5,
      },
      title: {
        text: "Ventas del mes",
        align: "left",
      },
      xaxis: {
        categories: queryData?.map((item) => {
          return `${moment(item.date).format("DD")}`;
        }),
      },
      yaxis: {
        show: false,
        categories: queryData?.map((item) => {
          return `${item.date}`;
        }),
      },
    },
    series: [
      {
        data: queryData?.map((item) => {
          return `${item.saldo}`;
        }),
      },
    ],
  };

  return (
    <ReactApexChart
      options={chart.options}
      series={chart.series}
      type="line"
      width={400}
      height={320}
    />
  );
};
