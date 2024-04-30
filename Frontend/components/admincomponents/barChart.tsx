import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { defaults } from 'chart.js/auto';
import { start } from 'repl';

Chart.register(...registerables);

defaults.responsive = true;
defaults.maintainAspectRatio = false;
defaults.plugins.title.align = 'start';
defaults.plugins.title.color = 'black';

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
        text: 'Overview',
        font: {
          size: 25,
          weight: 'bold' as 'bold',
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
        // Adjust the padding to match your needs
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
            weight: 'bold' as 'bold',
          },
        },
        drawBorder: false,
      },
      y: {
        type: 'linear',
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold' as 'bold',
          },
          callback: function (value: number) {
            return '₹' + value;
          },
        },
        drawBorder: false,
      },
    },
  };
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const labels = months;

  const data = {
    labels,
    datasets: [
      {
        backgroundColor: 'rgba(0, 0, 0, 1)',
        data: monthlyData,
        barPercentage: 0.9,
        borderRadius: 3,
        borderSkipped: false,
      },
    ],
  };

  return (
    <div className="h-[400px] md:w-[1700px] border-[2px] border-gray-200 p-3 rounded-xl">
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
