import React from 'react';

function DateRangePicker({ startDate, endDate, onChange }) {
  return (
    <div className="date-range-picker">
      <input
        type="date"
        value={startDate || ''}
        onChange={(e) => onChange({ startDate: e.target.value, endDate })}
      />
      <span>to</span>
      <input
        type="date"
        value={endDate || ''}
        onChange={(e) => onChange({ startDate, endDate: e.target.value })}
      />
    </div>
  );
}

export default DateRangePicker; 