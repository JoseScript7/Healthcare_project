import React, { useState, useEffect } from 'react';
import { getFacilities } from '../../services/facility.service.js';
import { initiateTransfer } from '../../services/transfer.service.js';

function TransferModal({ item, onClose, onSuccess }) {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    to_facility_id: '',
    quantity: 1
  });

  useEffect(() => {
    loadFacilities();
  }, []);

  const loadFacilities = async () => {
    try {
      const data = await getFacilities();
      setFacilities(data);
    } catch (error) {
      setError('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await initiateTransfer({
        item_id: item.item_id,
        ...formData
      });
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message || 'Transfer failed');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="transfer-modal">
      <h3>Transfer {item.name}</h3>
      {error && <div className="error">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>To Facility:</label>
          <select
            value={formData.to_facility_id}
            onChange={(e) => setFormData({ ...formData, to_facility_id: e.target.value })}
            required
          >
            <option value="">Select Facility</option>
            {facilities.map(facility => (
              <option key={facility.facility_id} value={facility.facility_id}>
                {facility.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit">Transfer</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default TransferModal; 