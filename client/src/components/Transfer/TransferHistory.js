import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { transferService } from '../../services/transfer.service';
import LoadingSpinner from '../common/LoadingSpinner';

function TransferHistory({ transferId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [transferId]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await transferService.getTransferHistory(transferId);
      setHistory(data);
    } catch (error) {
      console.error('Load History Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="transfer-history">
      <h3>Transfer History</h3>
      <div className="history-timeline">
        {history.map((entry, index) => (
          <div key={entry.history_id} className="history-item">
            <div className="timeline-dot" />
            <div className="history-content">
              <div className="history-header">
                <span className={`status-badge ${entry.status}`}>
                  {entry.status}
                </span>
                <span className="history-date">
                  {format(new Date(entry.created_at), 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <p className="action-by">
                {entry.ActionBy.name}
              </p>
              {entry.notes && (
                <p className="history-notes">{entry.notes}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransferHistory; 