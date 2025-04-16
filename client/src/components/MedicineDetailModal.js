import React, { useState } from 'react';
import { FaTimes, FaSync, FaTruck, FaChartLine, FaBoxOpen, FaHistory } from 'react-icons/fa';
import './MedicineDetailModal.css';

// Sub-modal for updating stock
const UpdateStockModal = ({ medicine, onClose, onUpdate }) => {
  const [quantity, setQuantity] = useState('');
  const [action, setAction] = useState('add');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || !reason) return;

    onUpdate({
      action,
      quantity: parseInt(quantity),
      reason,
      date: new Date().toISOString(),
    });
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
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Reason</label>
          <select value={reason} onChange={(e) => setReason(e.target.value)}>
            <option value="">Select reason...</option>
            <option value="New Supply">New Supply</option>
            <option value="Stock Correction">Stock Correction</option>
            <option value="Damaged">Damaged</option>
            <option value="Expired">Expired</option>
            <option value="Dispensed">Dispensed</option>
          </select>
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Update Stock
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-modal for placing orders
const PlaceOrderModal = ({ medicine, onClose, onOrder }) => {
  const [quantity, setQuantity] = useState(medicine.reorderPoint);
  const [supplier, setSupplier] = useState(medicine.manufacturer);
  const [priority, setPriority] = useState('normal');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onOrder({
      quantity: parseInt(quantity),
      supplier,
      priority,
      notes,
      orderDate: new Date().toISOString(),
      expectedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'Processing'
    });
    onClose();
  };

  return (
    <div className="sub-modal">
      <h3>Place New Order</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Order Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Supplier</label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any special instructions..."
          />
        </div>
        <div className="modal-actions">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Place Order
          </button>
        </div>
      </form>
    </div>
  );
};

// Sub-modal for usage history
const UsageHistoryModal = ({ medicine, onClose }) => {
  // Generate sample usage history
  const generateUsageHistory = () => {
    const history = [];
    const actions = ['Added', 'Removed', 'Dispensed', 'Expired'];
    const departments = ['Pharmacy', 'Emergency', 'ICU', 'General Ward', 'OPD'];
    
    for (let i = 0; i < 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 3);
      
      history.push({
        date: date.toISOString().split('T')[0],
        action: actions[Math.floor(Math.random() * actions.length)],
        quantity: Math.floor(Math.random() * 50) + 10,
        department: departments[Math.floor(Math.random() * departments.length)],
        user: `User${Math.floor(Math.random() * 5) + 1}`,
        balance: Math.floor(Math.random() * 1000) + 100
      });
    }
    
    return history;
  };

  const usageHistory = generateUsageHistory();

  return (
    <div className="sub-modal usage-history">
      <h3>Usage History</h3>
      <div className="history-table-container">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Department</th>
              <th>User</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {usageHistory.map((record, index) => (
              <tr key={index}>
                <td>{record.date}</td>
                <td>
                  <span className={`action-badge ${record.action.toLowerCase()}`}>
                    {record.action}
                  </span>
                </td>
                <td>{record.quantity}</td>
                <td>{record.department}</td>
                <td>{record.user}</td>
                <td>{record.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal-actions">
        <button onClick={onClose} className="btn-secondary">
          Close
        </button>
      </div>
    </div>
  );
};

const MedicineDetailModal = ({ medicine, onClose, onUpdateStock, onPlaceOrder }) => {
  const [activeSubModal, setActiveSubModal] = useState(null);

  const handleUpdateStock = (updateDetails) => {
    onUpdateStock(medicine.id, updateDetails);
    setActiveSubModal(null);
  };

  const handlePlaceOrder = (orderDetails) => {
    onPlaceOrder(medicine.id, orderDetails);
    setActiveSubModal(null);
  };

  return (
    <div className="modal-overlay" onClick={() => !activeSubModal && onClose()}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {/* Main modal content */}
        {!activeSubModal && (
          <>
        <div className="modal-header">
          <div>
            <h2>{medicine.name}</h2>
            <p className="category">Medicine</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-item">
            <h3>Current Stock</h3>
            <div className="stat-value">{medicine.currentStock}</div>
            <p className="stat-label">tablets</p>
          </div>
          <div className={`stat-item ${medicine.daysUntilExpiry < 30 ? 'warning' : ''}`}>
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

        <div className="info-sections">
          <div className="product-info">
            <h3>Product Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Manufacturer</label>
                <p>{medicine.manufacturer}</p>
              </div>
              <div className="info-item">
                <label>Serial Number</label>
                <p>{medicine.serialNumber}</p>
              </div>
              <div className="info-item">
                <label>Storage Location</label>
                <p>{medicine.storageLocation}</p>
              </div>
              <div className="info-item">
                <label>Expiry Date</label>
                <p className="expiry-date">{medicine.expiryDate}</p>
              </div>
            </div>
          </div>

          <div className="status-actions">
            <div className="status-tags">
              <span className="status-tag">{medicine.stockStatus}</span>
              <span className="category-tag">{medicine.category}</span>
            </div>

            {medicine.daysUntilExpiry < 30 && (
              <div className="expiry-warning">
                <span className="warning-icon">⚠️</span>
                <p>Product will expire in {medicine.daysUntilExpiry} days</p>
              </div>
            )}

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
                <FaTruck /> Place Order
              </button>
                  <button 
                    className="action-btn secondary"
                    onClick={() => setActiveSubModal('history')}
                  >
                    <FaHistory /> View Usage History
              </button>
            </div>
          </div>
        </div>
          </>
        )}

        {/* Sub-modals */}
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

export default MedicineDetailModal; 