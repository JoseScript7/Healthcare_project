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

function StockChart({ data }) {
  const chartData = {
    labels: data.map(item => item.InventoryItem.name),
    datasets: [
      {
        label: 'Current Stock',
        data: data.map(item => item.quantity),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
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
        text: 'Current Stock Levels'
      }
    }
  };

  return <Bar data={chartData} options={options} />;
}

export default StockChart; 