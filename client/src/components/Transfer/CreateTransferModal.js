import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { facilityService } from '../../services/facility.service';
import { inventoryService } from '../../services/inventory.service';
import Modal from '../common/Modal';

function CreateTransferModal({ isOpen, onClose, onSubmit }) {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState([]);
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    to_facility_id: '',
    item_id: '',
    quantity: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadFacilities();
      loadItems();
    }
  }, [isOpen]);

  const loadFacilities = async () => {
    try {
      const data = await facilityService.getFacilities();
      setFacilities(data.filter(f => f.facility_id !== user.facility_id));
    } catch (error) {
      console.error('Load Facilities Error:', error);
    }
  };

  const loadItems = async () => {
    try {
      const data = await inventoryService.getInventoryItems(user.facility_id);
      setItems(data);
    } catch (error) {
      console.error('Load Items Error:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      from_facility_id: user.facility_id
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Transfer">
      <form onSubmit={handleSubmit} className="transfer-form">
        <div className="form-group">
          <label htmlFor="to_facility">To Facility</label>
          <select
            id="to_facility"
            value={formData.to_facility_id}
            onChange={(e) => setFormData({
              ...formData,
              to_facility_id: e.target.value
            })}
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
          <label htmlFor="item">Item</label>
          <select
            id="item"
            value={formData.item_id}
            onChange={(e) => setFormData({
              ...formData,
              item_id: e.target.value
            })}
            required
          >
            <option value="">Select Item</option>
            {items.map(item => (
              <option key={item.item_id} value={item.item_id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            value={formData.quantity}
            onChange={(e) => setFormData({
              ...formData,
              quantity: e.target.value
            })}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({
              ...formData,
              notes: e.target.value
            })}
            rows="3"
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary">Create Transfer</button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTransferModal; 