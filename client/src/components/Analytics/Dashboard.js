import React, { useState, useEffect } from 'react';
import { getAnalytics } from '../../services/analytics.service';
import StockChart from './StockChart';
import MovementsChart from './MovementsChart';
import ExpiryChart from './ExpiryChart';
import UtilizationChart from './UtilizationChart';
import { downloadInventoryReport } from '../../services/report.service';
import './styles.css';

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState('30');

  useEffect(() => {
    loadAnalytics();
  }, [timeframe]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const analyticsData = await getAnalytics(timeframe);
      setData(analyticsData);
    } catch (error) {
      setError('Failed to load analytics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    try {
      await downloadInventoryReport(timeframe);
    } catch (error) {
      setError('Failed to download report');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className="analytics-dashboard">
      <div className="dashboard-header">
        <h2>Analytics Dashboard</h2>
        <div className="dashboard-actions">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="timeframe-select"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button onClick={handleDownloadReport} className="download-button">
            Download Report
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="chart-container">
          <h3>Stock Levels</h3>
          <StockChart data={data.stock} />
        </div>

        <div className="chart-container">
          <h3>Stock Movements</h3>
          <MovementsChart data={data.movements} />
        </div>

        <div className="chart-container">
          <h3>Expiring Items</h3>
          <ExpiryChart data={data.expiringItems} />
        </div>

        <div className="chart-container">
          <h3>Stock Utilization</h3>
          <UtilizationChart data={data.utilization} />
        </div>
      </div>

      <div className="alerts-section">
        <h3>Alerts</h3>
        <div className="alerts-grid">
          {data.lowStock.length > 0 && (
            <div className="alert-card warning">
              <h4>Low Stock Items</h4>
              <p>{data.lowStock.length} items below minimum quantity</p>
            </div>
          )}
          {data.expiringItems.length > 0 && (
            <div className="alert-card danger">
              <h4>Expiring Soon</h4>
              <p>{data.expiringItems.length} items expiring within 90 days</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 