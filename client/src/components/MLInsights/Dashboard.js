import React, { useState, useEffect } from 'react';
import { mlService } from '../../services/ml.service';
import ForecastChart from './ForecastChart';
import OptimizationTable from './OptimizationTable';
import RiskAssessment from './RiskAssessment';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './styles.css';

function MLInsightsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    forecast: null,
    optimization: null,
    risk: null
  });

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const [forecast, risk] = await Promise.all([
        mlService.getForecast(30),
        mlService.getExpiryRisk()
      ]);

      setData({
        forecast,
        risk
      });
    } catch (error) {
      setError('Failed to load ML insights');
      console.error('ML Insights Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadInsights} />;

  return (
    <div className="ml-insights-dashboard">
      <h2>Inventory Insights</h2>
      
      <div className="insights-grid">
        <div className="insight-card">
          <h3>Demand Forecast</h3>
          <ForecastChart data={data.forecast} />
        </div>

        <div className="insight-card">
          <h3>Stock Risk Assessment</h3>
          <RiskAssessment data={data.risk} />
        </div>
      </div>
    </div>
  );
}

export default MLInsightsDashboard; 