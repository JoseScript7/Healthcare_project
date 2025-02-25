import React from 'react';
import { useNavigate } from 'react-router-dom';

function RiskAssessment({ data }) {
  const navigate = useNavigate();

  if (!data?.risk_assessment) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return 'var(--color-danger)';
      case 'medium': return 'var(--color-warning)';
      case 'low': return 'var(--color-success)';
      default: return 'var(--color-text)';
    }
  };

  const handleItemClick = (itemId) => {
    navigate(`/inventory/${itemId}`);
  };

  return (
    <div className="risk-assessment">
      <div className="risk-list">
        {data.risk_assessment.map(item => (
          <div
            key={item.item_id}
            className="risk-item"
            onClick={() => handleItemClick(item.item_id)}
            style={{ borderLeftColor: getRiskColor(item.risk_level) }}
          >
            <div className="risk-item-header">
              <h4>{item.name}</h4>
              <span className={`risk-badge ${item.risk_level}`}>
                {item.risk_level}
              </span>
            </div>
            <p>Risk Score: {(item.risk_score * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RiskAssessment; 