import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

function ExpiryChart({ data }) {
  const expiringCounts = data.reduce((acc, item) => {
    const daysUntilExpiry = Math.ceil(
      (new Date(item.expiry_date) - new Date()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysUntilExpiry <= 30) acc['30 days'] = (acc['30 days'] || 0) + 1;
    else if (daysUntilExpiry <= 60) acc['60 days'] = (acc['60 days'] || 0) + 1;
    else acc['90 days'] = (acc['90 days'] || 0) + 1;
    
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(expiringCounts),
    datasets: [
      {
        data: Object.values(expiringCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ]
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
        text: 'Items by Expiry Timeline'
      }
    }
  };

  return <Doughnut data={chartData} options={options} />;
}

export default ExpiryChart; 