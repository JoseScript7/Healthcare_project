import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MovementsChart({ data }) {
  const chartData = {
    labels: data.map(item => new Date(item.created_at).toLocaleDateString()),
    datasets: [
      {
        label: 'Stock Movements',
        data: data.map(item => item.quantity),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
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
        text: 'Stock Movement Trends'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Line data={chartData} options={options} />;
}

export default MovementsChart; 