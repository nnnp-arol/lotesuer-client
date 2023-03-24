import ReactApexChart from "react-apexcharts";

export const DebtSellersChart = ({ queryData }) => {
  const chart = {
    series: [
      {
        data: queryData?.map((item) => {
          return `${item.debt}`;
        }),
      },
    ],
    options: {
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
            formatter: (seriesName) => "",
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
        background: "white",
        height: 350,
        type: "bar",
        events: {
          click: function (chart, w, e) {
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
          horizontal: false,
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
    },
  };

  return (
    <ReactApexChart
      type={chart.options.chart.type}
      options={chart.options}
      series={chart.series}
    />
  );
};
