import ReactApexChart from "react-apexcharts";
import React from "react";
import { ApexOptions } from "apexcharts";

type gamesChartPropType = {
  series: any[];
};

export const GamesChart: (props: gamesChartPropType) => JSX.Element = ({
  series,
}) => {
  const options: ApexOptions = {
    stroke: {
      show: false,
      curve: "smooth",
      lineCap: "butt",
      colors: undefined,
      width: 2,
      dashArray: 0,
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "21px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 600,
              color: "#E2C43F",
              offsetY: -10,
              formatter: function (val: any) {
                return val;
              },
            },
            value: {
              show: true,
              fontSize: "19px",
              fontFamily: "Helvetica, Arial, sans-serif",
              fontWeight: 400,
              color: "#E2C43F",
              offsetY: 6,
              formatter: function (val: any) {
                return `$ ${parseFloat(val).toFixed(2)}`;
              },
            },
          },
        },
      },
    },
    labels: [
      "quiniela",
      "quini6",
      "loto",
      "loto5",
      "brinco",
      "poceada",
      "express",
    ],
    dataLabels: {
      style: {
        fontSize: "10px",
        fontFamily: "Helvetica, Arial, sans-serif",
        fontWeight: 100,
      },
      enabled: true,
      textAnchor: "end",
      formatter: (val, opt) => {
        return opt.w.config.series[opt.seriesIndex].toFixed(2);
      },
    },
    fill: {
      colors: [
        "#293757",
        "#701a75",
        "#568D4B",
        "#D5BB56",
        "#D26A1B",
        "#4368B6",
        "#A41D1A",
      ],
    },
    legend: {
      floating: false,
      show: true,
      position: "right",
      labels: {
        colors: "white",
      },
      markers: {
        offsetX: -5,
        fillColors: [
          "#293757",
          "#701a75",
          "#568D4B",
          "#D5BB56",
          "#D26A1B",
          "#4368B6",
          "#A41D1A",
        ],
      },
      onItemHover: {
        highlightDataSeries: true,
      },
      onItemClick: {
        toggleDataSeries: true,
      },
    },
    tooltip: {
      enabled: false,
    },
    chart: {
      type: "donut",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1600,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
    },
  };

  return <ReactApexChart options={options} series={series} type="donut" />;
};
