import React, { useState } from 'react';
import { format } from 'date-fns';

function ScheduleForm({ schedule = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    report_type: schedule?.report_type || 'inventory',
    frequency: schedule?.frequency || 'daily',
    format: schedule?.format || 'excel',
    recipients: schedule?.recipients?.join(', ') || '',
    parameters: schedule?.parameters || {}
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('parameters.')) {
      const paramKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        parameters: { ...prev.parameters, [paramKey]: value }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email format
    const emails = formData.recipients
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmails = emails.every(email => emailRegex.test(email));

    if (emails.length > 0 && !validEmails) {
      alert('Please enter valid email addresses');
      return;
    }

    const data = {
      ...formData,
      recipients: emails
    };

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="schedule-form">
      <div className="form-group">
        <label>Report Type</label>
        <select
          name="report_type"
          value={formData.report_type}
          onChange={handleChange}
          required
        >
          <option value="inventory">Inventory Report</option>
          <option value="transaction">Transaction Report</option>
          <option value="expiry">Expiry Report</option>
          <option value="low_stock">Low Stock Report</option>
        </select>
      </div>

      <div className="form-group">
        <label>Frequency</label>
        <select
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          required
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      <div className="form-group">
        <label>Format</label>
        <select
          name="format"
          value={formData.format}
          onChange={handleChange}
          required
        >
          <option value="excel">Excel</option>
          <option value="pdf">PDF</option>
        </select>
      </div>

      {formData.report_type === 'transaction' && (
        <div className="form-group">
          <label>Time Range</label>
          <select
            name="parameters.range"
            value={formData.parameters.range || 'last7days'}
            onChange={handleChange}
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="lastMonth">Last Month</option>
          </select>
        </div>
      )}

      {formData.report_type === 'expiry' && (
        <div className="form-group">
          <label>Expiry Threshold</label>
          <select
            name="parameters.threshold"
            value={formData.parameters.threshold || '30days'}
            onChange={handleChange}
          >
            <option value="30days">30 Days</option>
            <option value="60days">60 Days</option>
            <option value="90days">90 Days</option>
          </select>
        </div>
      )}

      {formData.report_type === 'low_stock' && (
        <div className="form-group">
          <label>Stock Threshold (%)</label>
          <input
            type="number"
            name="parameters.threshold"
            value={formData.parameters.threshold || 20}
            onChange={handleChange}
            min="1"
            max="100"
          />
        </div>
      )}

      <div className="form-group">
        <label>Recipients (comma-separated emails)</label>
        <input
          type="text"
          name="recipients"
          value={formData.recipients}
          onChange={handleChange}
          placeholder="email1@example.com, email2@example.com"
        />
        <small className="help-text">Leave empty to send only to yourself</small>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="cancel-btn">
          Cancel
        </button>
        <button type="submit" className="submit-btn">
          {schedule ? 'Update Schedule' : 'Create Schedule'}
        </button>
      </div>
    </form>
  );
}

export default ScheduleForm; 