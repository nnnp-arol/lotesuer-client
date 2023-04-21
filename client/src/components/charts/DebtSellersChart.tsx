import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Sale, Seller } from "../../utils/interfaces";
import React from "react";

type queryDataType = {
  debt: number;
  seller: Seller;
};

// type DebtSellersChartType = (props: {
//   queryData: queryDataType[];
// }) => JSX.Element;

export const DebtSellersChart: (props: {
  queryData: queryDataType[] | undefined;
}) => JSX.Element = ({ queryData }) => {
  const options: ApexOptions = {
    tooltip: {
      enabled: true,
      // fillSeriesColor: true,
      theme: "dark",
      intersect: false,
      followCursor: false,
      marker: {
        show: true,
      },
      fixed: {
        enabled: true,
        position: "topRight",
        offsetX: -100,
        // offsetY: -50,
      },
      y: {
        formatter: undefined,
        title: {
          formatter: () => "",
        },
      },
    },
    chart: {
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: false,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: false,
          customIcons: [],
        },
      },
      // background: "black",
      height: 350,
      type: "bar",
      events: {
        click: function () {
          // console.log(chart, w, e)
        },
      },
    },
    // colors: colors,
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
        borderRadius: 4,
        horizontal: true,
      },
    },
    dataLabels: {
      offsetX: 0,
      offsetY: 200,
      enabled: true,
      distributed: true,
      textAnchor: "middle",
      background: {
        enabled: true,
        foreColor: "red",
        borderRadius: 2,
        borderWidth: 1,
        borderColor: "black",
      },
    },
    legend: {
      show: false,
    },
    yaxis: {
      show: false,
      min: 1,
      max: 1000,
    },
    xaxis: {
      position: "bottom",
      categories: queryData?.map((item) => {
        return `${item.seller.id_seller} - ${item.seller.last_name}`;
      }),
      labels: {
        show: true,
        rotate: -45,
        rotateAlways: true,
        hideOverlappingLabels: false,
        showDuplicates: false,
        // trim: true,
        // minHeight: 10,
        // maxHeight: 220,
        style: {
          // colors: colors,
          fontSize: "12px",
        },
      },
    },
  };
  const series = queryData
    ? [
        {
          data: queryData.map((item) => {
            return item.debt;
          }),
        },
      ]
    : [];

  return <ReactApexChart type="bar" options={options} series={series} />;
};
