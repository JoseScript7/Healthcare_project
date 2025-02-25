import React, { useState, useEffect } from 'react';
import { transferService } from '../../services/transfer.service';
import TransferCard from './TransferCard';
import CreateTransferModal from './CreateTransferModal';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import './styles.css';
import { useSocket } from '../../contexts/SocketContext';

function TransferList() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { socket } = useSocket();

  useEffect(() => {
    loadTransfers();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('transfer_update', (updatedTransfer) => {
      setTransfers(prev => prev.map(transfer => 
        transfer.transfer_id === updatedTransfer.transfer_id
          ? updatedTransfer
          : transfer
      ));
    });

    return () => {
      socket.off('transfer_update');
    };
  }, [socket]);

  const loadTransfers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await transferService.getTransfers();
      setTransfers(data);
    } catch (error) {
      setError('Failed to load transfers');
      console.error('Load Transfers Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async (transferData) => {
    try {
      await transferService.createTransfer(transferData);
      setIsModalOpen(false);
      loadTransfers();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleApprove = async (transferId) => {
    try {
      await transferService.approveTransfer(transferId);
      loadTransfers();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleComplete = async (transferId) => {
    try {
      await transferService.completeTransfer(transferId);
      loadTransfers();
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadTransfers} />;

  return (
    <div className="transfer-list-container">
      <div className="transfer-header">
        <h2>Stock Transfers</h2>
        <button 
          className="create-transfer-btn"
          onClick={() => setIsModalOpen(true)}
        >
          New Transfer
        </button>
      </div>

      <div className="transfer-grid">
        {transfers.map(transfer => (
          <TransferCard
            key={transfer.transfer_id}
            transfer={transfer}
            onApprove={handleApprove}
            onComplete={handleComplete}
          />
        ))}
      </div>

      <CreateTransferModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransfer}
      />
    </div>
  );
}

export default TransferList; 