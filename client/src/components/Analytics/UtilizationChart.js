import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UtilizationChart({ data }) {
  const chartData = {
    labels: data.map(item => item.InventoryItem.name),
    datasets: [
      {
        label: 'Utilization Rate',
        data: data.map(item => item.total_quantity),
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Stock Utilization by Item'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Quantity Used'
        }
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}

export default UtilizationChart; 