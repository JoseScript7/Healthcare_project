import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';

function ForecastChart({ data }) {
  if (!data?.forecast) return null;

  const chartData = data.forecast.map((value, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return {
      date: format(date, 'MMM dd'),
      forecast: value
    };
  });

  return (
    <div className="forecast-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="forecast"
            stroke="#8884d8"
            name="Predicted Demand"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ForecastChart; 