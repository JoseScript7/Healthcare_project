import React, { useState, useEffect } from 'react';
import { getItemStock, updateItemStock } from '../../services/inventory.service';
import { useAuth } from '../../contexts/AuthContext';
import TransferModal from './TransferModal';

function ItemDetail({ item, onClose }) {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const [showTransfer, setShowTransfer] = useState(false);

  useEffect(() => {
    loadStocks();
  }, [item.item_id]);

  const loadStocks = async () => {
    try {
      setLoading(true);
      const data = await getItemStock(item.item_id);
      setStocks(data);
    } catch (error) {
      setError('Failed to load stock information');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (stockData) => {
    try {
      await updateItemStock(item.item_id, stockData);
      await loadStocks(); // Reload stocks after update
    } catch (error) {
      setError('Failed to update stock');
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="item-detail">
      <h3>{item.name}</h3>
      <div className="item-info">
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Description:</strong> {item.description}</p>
        <p><strong>Unit:</strong> {item.unit}</p>
      </div>

      <div className="stock-info">
        <h4>Stock Information</h4>
        {stocks.map(stock => (
          <div key={stock.stock_id} className="stock-entry">
            <p><strong>Facility:</strong> {stock.Facility.name}</p>
            <p><strong>Quantity:</strong> {stock.quantity}</p>
            <p><strong>Batch:</strong> {stock.batch_number}</p>
            <p><strong>Expiry:</strong> {new Date(stock.expiry_date).toLocaleDateString()}</p>
            {user.facility_id === stock.facility_id && (
              <button onClick={() => handleStockUpdate({
                quantity: stock.quantity,
                batch_number: stock.batch_number,
                expiry_date: stock.expiry_date
              })}>
                Update Stock
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="actions">
        {user.role !== 'manager' && (
          <button onClick={() => setShowTransfer(true)}>Transfer Stock</button>
        )}
        <button onClick={onClose}>Close</button>
      </div>

      {showTransfer && (
        <div className="modal">
          <TransferModal
            item={item}
            onClose={() => setShowTransfer(false)}
            onSuccess={loadStocks}
          />
        </div>
      )}
    </div>
  );
}

export default ItemDetail; 