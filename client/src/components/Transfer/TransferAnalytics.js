import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';
import { transferService } from '../../services/transfer.service';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './analytics.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

function TransferAnalytics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(6);

  useEffect(() => {
    loadMetrics();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transferService.getAnalytics(timeRange);
      setMetrics(data);
    } catch (error) {
      setError('Failed to load analytics');
      console.error('Analytics Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadMetrics} />;
  if (!metrics) return null;

  return (
    <div className="transfer-analytics">
      <div className="analytics-header">
        <h2>Transfer Analytics</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(Number(e.target.value))}
        >
          <option value={3}>Last 3 months</option>
          <option value={6}>Last 6 months</option>
          <option value={12}>Last 12 months</option>
        </select>
      </div>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Transfer Overview</h3>
          <div className="metric-stats">
            <div className="stat-item">
              <span className="stat-label">Total Transfers</span>
              <span className="stat-value">{metrics.totalTransfers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Incoming</span>
              <span className="stat-value">{metrics.incomingTransfers}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Outgoing</span>
              <span className="stat-value">{metrics.outgoingTransfers}</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Monthly Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.monthlyTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Transfers" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(metrics.statusDistribution).map(([name, value]) => ({
                  name,
                  value
                }))}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {Object.entries(metrics.statusDistribution).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card">
          <h3>Top Transfer Partners</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.topPartners}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Transfers" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default TransferAnalytics; 