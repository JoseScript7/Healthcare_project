import React, { useState } from 'react';
import { FaTimes, FaSync, FaShoppingCart, FaHistory } from 'react-icons/fa';
import { useInventory } from '../context/InventoryContext';
import './MedicineModal.css';

const UpdateStockModal = ({ medicine, onClose, onUpdate }) => {
  const [quantity, setQuantity] = useState(medicine.currentStock);
  const [action, setAction] = useState('add');

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(action === 'add' ? quantity : -quantity);
    onClose();
  };

  return (
    <div className="sub-modal">
      <h3>Update Stock</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Action</label>
          <select value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="add">Add Stock</option>
            <option value="remove">Remove Stock</option>
          </select>
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Update</button>
        </div>
      </form>
    </div>
  );
};

const PlaceOrderModal = ({ medicine, onClose, onOrder }) => {
  const [orderQuantity, setOrderQuantity] = useState(medicine.reorderPoint);
  const [supplier, setSupplier] = useState(medicine.manufacturer);

  const handleSubmit = (e) => {
    e.preventDefault();
    onOrder({
      quantity: orderQuantity,
      supplier,
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="sub-modal">
      <h3>Place Order</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Quantity</label>
          <input
            type="number"
            min="1"
            value={orderQuantity}
            onChange={(e) => setOrderQuantity(parseInt(e.target.value))}
          />
        </div>
        <div className="form-group">
          <label>Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
          />
        </div>
        <div className="form-actions">
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit">Place Order</button>
        </div>
      </form>
    </div>
  );
};

const UsageHistoryModal = ({ medicine, onClose }) => {
  // Sample usage history data
  const usageHistory = [
    { date: '2024-02-20', quantity: 50, type: 'Dispensed', department: 'Emergency' },
    { date: '2024-02-18', quantity: 100, type: 'Restocked', department: 'Pharmacy' },
    { date: '2024-02-15', quantity: 30, type: 'Dispensed', department: 'Pediatrics' }
  ];

  return (
    <div className="sub-modal">
      <h3>Usage History</h3>
      <div className="usage-history">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Department</th>
            </tr>
          </thead>
          <tbody>
            {usageHistory.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>{record.type}</td>
                <td>{record.quantity}</td>
                <td>{record.department}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

const MedicineModal = ({ medicine, onClose }) => {
  const { updateStock, placeOrder } = useInventory();
  const [activeSubModal, setActiveSubModal] = useState(null);

  const handleUpdateStock = (quantityChange) => {
    updateStock(medicine.id, quantityChange);
    setActiveSubModal(null);
  };

  const handlePlaceOrder = (orderDetails) => {
    placeOrder(medicine.id, orderDetails);
    setActiveSubModal(null);
  };

  return (
    <div className="modal-overlay" onClick={() => !activeSubModal && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2>{medicine.name}</h2>
            <p className="category">{medicine.category}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-item">
            <h3>Current Stock</h3>
            <div className="stat-value">{medicine.currentStock}</div>
            <p className="stat-label">{medicine.unit}</p>
          </div>
          <div className="stat-item warning">
            <h3>Days Until Expiry</h3>
            <div className="stat-value">{medicine.daysUntilExpiry}</div>
            <p className="stat-label">days remaining</p>
          </div>
          <div className="stat-item">
            <h3>Reorder Point</h3>
            <div className="stat-value">{medicine.reorderPoint}</div>
            <p className="stat-label">minimum stock</p>
          </div>
        </div>

        {/* Product Information */}
        <div className="product-info">
          <h3>Product Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Manufacturer</label>
              <p>{medicine.manufacturer}</p>
            </div>
            <div className="info-item">
              <label>Storage Location</label>
              <p>{medicine.location}</p>
            </div>
            <div className="info-item">
              <label>Serial Number</label>
              <p>{medicine.serialNumber}</p>
            </div>
            <div className="info-item">
              <label>Expiry Date</label>
              <p className="expiry-date">{medicine.expiryDate}</p>
            </div>
          </div>
        </div>

        {/* Status Tags */}
        <div className="status-tags">
          <span className="status-tag in-stock">In Stock</span>
          <span className="status-tag category">{medicine.category}</span>
        </div>

        {/* Warning Message */}
        {medicine.daysUntilExpiry < 30 && (
          <div className="expiry-warning">
            <span className="warning-icon">⚠️</span>
            <div>
              <h4>Expiry Warning</h4>
              <p>Product will expire in {medicine.daysUntilExpiry} days</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => setActiveSubModal('update')}
          >
            <FaSync /> Update Stock
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setActiveSubModal('order')}
          >
            <FaShoppingCart /> Place Order
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => setActiveSubModal('history')}
          >
            <FaHistory /> View Usage History
          </button>
        </div>

        {/* Sub Modals */}
        {activeSubModal === 'update' && (
          <UpdateStockModal
            medicine={medicine}
            onClose={() => setActiveSubModal(null)}
            onUpdate={handleUpdateStock}
          />
        )}

        {activeSubModal === 'order' && (
          <PlaceOrderModal
            medicine={medicine}
            onClose={() => setActiveSubModal(null)}
            onOrder={handlePlaceOrder}
          />
        )}

        {activeSubModal === 'history' && (
          <UsageHistoryModal
            medicine={medicine}
            onClose={() => setActiveSubModal(null)}
          />
        )}
      </div>
    </div>
  );
};

export default MedicineModal; 