import React, { useState } from 'react';
import { reportService } from '../../services/report.service';
import DateRangePicker from '../common/DateRangePicker';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './styles.css';
import ScheduledReports from './ScheduledReports';

function ReportsDashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null
  });

  const handleGenerateInventoryReport = async (format) => {
    try {
      setLoading(true);
      setError(null);
      await reportService.generateInventoryReport(format);
    } catch (error) {
      setError('Failed to generate inventory report');
      console.error('Report Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTransactionReport = async () => {
    if (!dateRange.startDate || !dateRange.endDate) {
      setError('Please select a date range');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reportService.generateTransactionReport(
        dateRange.startDate,
        dateRange.endDate
      );
    } catch (error) {
      setError('Failed to generate transaction report');
      console.error('Transaction Report Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="reports-dashboard">
      <h2>Reports</h2>

      {error && (
        <ErrorMessage 
          message={error}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="reports-grid">
        <div className="report-card">
          <h3>Inventory Report</h3>
          <p>Generate a detailed report of current inventory levels</p>
          <div className="report-actions">
            <button 
              onClick={() => handleGenerateInventoryReport('excel')}
              className="report-btn excel"
            >
              Download Excel
            </button>
            <button 
              onClick={() => handleGenerateInventoryReport('pdf')}
              className="report-btn pdf"
            >
              Download PDF
            </button>
          </div>
        </div>

        <div className="report-card">
          <h3>Transaction Report</h3>
          <p>Generate a report of inventory transactions</p>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onChange={setDateRange}
          />
          <button 
            onClick={handleGenerateTransactionReport}
            className="report-btn excel"
            disabled={!dateRange.startDate || !dateRange.endDate}
          >
            Generate Report
          </button>
        </div>
      </div>

      <ScheduledReports />
    </div>
  );
}

export default ReportsDashboard; 