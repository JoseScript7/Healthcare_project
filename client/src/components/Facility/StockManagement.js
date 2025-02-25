import React, { useState } from 'react';
import { updateItemStock } from '../../services/inventory.service';

function StockManagement({ facility, inventory, onClose, onUpdate }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [stockData, setStockData] = useState({
    quantity: '',
    batch_number: '',
    expiry_date: ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateItemStock(selectedItem, {
        ...stockData,
        facility_id: facility.facility_id
      });
      onUpdate();
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to update stock');
    }
  };

  return (
    <div className="stock-management">
      <h3>Manage Stock</h3>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Item:</label>
          <select
            value={selectedItem}
            onChange={(e) => setSelectedItem(e.target.value)}
            required
          >
            <option value="">Select Item</option>
            {inventory.map(item => (
              <option key={item.item_id} value={item.item_id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            min="0"
            value={stockData.quantity}
            onChange={(e) => setStockData({ ...stockData, quantity: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Batch Number:</label>
          <input
            type="text"
            value={stockData.batch_number}
            onChange={(e) => setStockData({ ...stockData, batch_number: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Expiry Date:</label>
          <input
            type="date"
            value={stockData.expiry_date}
            onChange={(e) => setStockData({ ...stockData, expiry_date: e.target.value })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Update Stock</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default StockManagement; 