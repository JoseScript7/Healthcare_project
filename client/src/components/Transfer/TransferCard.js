import React, { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import TransferHistory from './TransferHistory';

function TransferCard({ transfer, onApprove, onComplete }) {
  const { user } = useAuth();
  const isManager = user.role === 'manager' || user.role === 'admin';
  const [showHistory, setShowHistory] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'var(--color-warning)';
      case 'approved': return 'var(--color-info)';
      case 'completed': return 'var(--color-success)';
      case 'rejected': return 'var(--color-danger)';
      default: return 'var(--color-text)';
    }
  };

  return (
    <div className="transfer-card">
      <div className="transfer-header">
        <span 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(transfer.status) }}
        >
          {transfer.status}
        </span>
        <span className="transfer-date">
          {format(new Date(transfer.created_at), 'MMM dd, yyyy')}
        </span>
      </div>

      <div className="transfer-content">
        <h3>{transfer.InventoryItem.name}</h3>
        <p className="quantity">Quantity: {transfer.quantity}</p>
        
        <div className="facility-info">
          <p>From: {transfer.FromFacility.name}</p>
          <p>To: {transfer.ToFacility.name}</p>
        </div>

        <p className="requester">
          Requested by: {transfer.Requester.name}
        </p>
      </div>

      {isManager && transfer.status === 'pending' && (
        <button
          className="approve-btn"
          onClick={() => onApprove(transfer.transfer_id)}
        >
          Approve Transfer
        </button>
      )}

      {isManager && transfer.status === 'approved' && (
        <button
          className="complete-btn"
          onClick={() => onComplete(transfer.transfer_id)}
        >
          Complete Transfer
        </button>
      )}

      <button
        className="view-history-btn"
        onClick={() => setShowHistory(!showHistory)}
      >
        {showHistory ? 'Hide History' : 'View History'}
      </button>

      {showHistory && (
        <TransferHistory transferId={transfer.transfer_id} />
      )}
    </div>
  );
}

export default TransferCard; 