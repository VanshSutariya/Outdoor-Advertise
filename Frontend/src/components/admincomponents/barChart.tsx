import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { defaults } from "chart.js/auto";
import numeral from "numeral";

Chart.register(...registerables);

defaults.responsive = true;
defaults.maintainAspectRatio = false;
defaults.plugins.title.align = "start";
defaults.plugins.title.color = "black";

interface BarData {
  monthlyData: number[] | [];
}
const BarGraph: React.FC<BarData> = ({ monthlyData }) => {
  const options: any = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Overview",
        font: {
          size: 25,
          weight: "bold" as "bold",
        },
        padding: {
          bottom: 20,
        },
      },
      colors: {
        enabled: true,
      },
      tooltip: {},
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 10,
        bottom: 10,
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold" as "bold",
          },
        },
        drawBorder: false,
      },
      y: {
        type: "linear",
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            weight: "bold" as "bold",
          },
          callback: function (value: number) {
            return formatRevenue(value);
          },
        },
        drawBorder: false,
      },
    },
  };
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const labels = months;

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: "rgba(0, 0, 0, 1)",
        data: monthlyData,
        barPercentage: 0.9,
        borderRadius: 3,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="overflow-auto  h-[475px] border-[2px] border-gray-200 xs:p-3 rounded-xl">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;

function formatRevenue(revenue: any) {
  const crore = 10000000;
  const lakh = 100000;

  if (revenue >= crore) {
    return `₹${(revenue / crore).toFixed(2)} CR`;
  } else if (revenue >= lakh) {
    return `₹${(revenue / lakh).toFixed(2)} L`;
  } else {
    return "₹" + numeral(revenue).format("0,0.00");
  }
}
