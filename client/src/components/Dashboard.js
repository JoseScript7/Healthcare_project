import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [orders, setOrders] = useState([
    {
      orderId: 'ORD-2024-001',
      medicine: 'NOW Foods, Vitamin D-3',
      quantity: 500,
      orderDate: '2024-02-15',
      expectedDelivery: '2024-03-01',
      status: 'In Transit'
    },
    {
      orderId: 'ORD-2024-002',
      medicine: 'Pneumococcal Vaccine',
      quantity: 50,
      orderDate: '2024-02-20',
      expectedDelivery: '2024-03-05',
      status: 'Processing'
    },
    {
      orderId: 'ORD-2024-003',
      medicine: 'Flu Vaccine',
      quantity: 150,
      orderDate: '2024-02-21',
      expectedDelivery: '2024-03-07',
      status: 'In Transit'
    }
  ]);

  const expiringMedicines = [
    {
      id: 1,
      name: 'Ventolin Inhaler',
      category: 'Respiratory',
      currentStock: 89,
      daysUntilExpiry: 25,
      reorderPoint: 50,
      manufacturer: 'GSK',
      storageLocation: 'Storage C-02',
      serialNumber: 'VEN-2024-001',
      expiryDate: '2024-05-15',
      status: 'Attention'
    },
    {
      id: 2,
      name: 'Atorvastatin',
      category: 'Cholesterol',
      currentStock: 45,
      daysUntilExpiry: 30,
      reorderPoint: 40,
      manufacturer: 'Pfizer',
      storageLocation: 'Storage B-05',
      serialNumber: 'ATO-2024-002',
      expiryDate: '2024-05-20',
      status: 'Attention'
    },
    {
      id: 3,
      name: 'Amoxicillin',
      category: 'Antibiotics',
      currentStock: 120,
      daysUntilExpiry: 45,
      reorderPoint: 100,
      manufacturer: 'Novartis',
      storageLocation: 'Storage A-01',
      serialNumber: 'AMO-2024-003',
      expiryDate: '2024-06-05',
      status: 'Warning'
    }
  ];

  const supplies = [
    { id: 1, name: 'Analgesics', image: '/images/aspirin.png', category: 'Pain Relief' },
    { id: 2, name: 'Antibiotics', image: '/images/antibiotics.png', category: 'Infection' },
    { id: 3, name: 'Hypoglycemics', image: '/images/glucose.png', category: 'Diabetes' },
    { id: 4, name: 'Sedatives', image: '/images/sedatives.png', category: 'Sleep' },
    { id: 5, name: 'Tranquilizer', image: '/images/tranquilizer.png', category: 'Anxiety' },
    { id: 6, name: 'Vitamins', image: '/images/vitamins.png', category: 'Supplements' }
  ];

  const handleAddNewItem = (formData) => {
    // Generate new order ID
    const newOrderId = `ORD-2024-${(orders.length + 1).toString().padStart(3, '0')}`;
    
    // Create new order
    const newOrder = {
      orderId: newOrderId,
      medicine: formData.name,
      quantity: parseInt(formData.currentStock),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: formData.expectedDelivery,
      status: 'Processing'
    };

    // Add to orders
    setOrders([...orders, newOrder]);
    setShowAddModal(false);
  };

  const handleGenerateReport = () => {
    // Add report generation logic
    console.log('Generating report...');
  };

  const handleUpdateStock = (medicineId) => {
    // Add stock update logic
    console.log('Updating stock for medicine:', medicineId);
  };

  const handlePlaceOrder = (medicineId) => {
    // Add order placement logic
    console.log('Placing order for medicine:', medicineId);
  };

  const handleViewHistory = (medicineId) => {
    // Add history viewing logic
    console.log('Viewing history for medicine:', medicineId);
  };

  // Medicine Detail Modal Component
  const MedicineDetailModal = ({ medicine, onClose }) => (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>{medicine.name}</h2>
            <p className="category">{medicine.category}</p>
          </div>
          <button className="close-modal" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="medicine-stats">
          <div className="stat-box">
            <h3>Current Stock</h3>
            <div className="stat-value">{medicine.currentStock}</div>
            <p className="stat-label">{medicine.unit}</p>
          </div>
          <div className="stat-box warning">
            <h3>Days Until Expiry</h3>
            <div className="stat-value">{medicine.daysUntilExpiry}</div>
            <p className="stat-label">days remaining</p>
          </div>
          <div className="stat-box">
            <h3>Reorder Point</h3>
            <div className="stat-value">{medicine.reorderPoint}</div>
            <p className="stat-label">minimum stock</p>
          </div>
        </div>

        <div className="product-info">
          <h3>Product Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Manufacturer</label>
              <p>{medicine.manufacturer}</p>
            </div>
            <div className="info-item">
              <label>Storage Location</label>
              <p>{medicine.storageLocation}</p>
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

          <div className="tags-container">
            {medicine.tags.map((tag, index) => (
              <span key={index} className={`tag ${tag.toLowerCase().replace(' ', '-')}`}>
                {tag}
              </span>
            ))}
          </div>

          {medicine.daysUntilExpiry <= 30 && (
            <div className="expiry-warning">
              <i className="fas fa-exclamation-triangle"></i>
              <div>
                <h4>Expiry Warning</h4>
                <p>Product will expire in {medicine.daysUntilExpiry} days</p>
              </div>
            </div>
          )}

          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => handleUpdateStock(medicine.id)}
            >
              <i className="fas fa-sync"></i>
              Update Stock
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handlePlaceOrder(medicine.id)}
            >
              <i className="fas fa-shopping-cart"></i>
              Place Order
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => handleViewHistory(medicine.id)}
            >
              <i className="fas fa-history"></i>
              View Usage History
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Add New Item Modal Component
  const AddItemModal = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      name: '',
      category: '',
      currentStock: '',
      reorderPoint: '',
      manufacturer: '',
      storageLocation: '',
      expiryDate: '',
      expectedDelivery: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };

    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          <div className="modal-header">
            <h2>Add New Item</h2>
            <button className="close-modal" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <form className="add-item-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Medicine Name</label>
              <input 
                type="text" 
                required 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select 
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Select Category</option>
                {supplies.map(supply => (
                  <option key={supply.id} value={supply.category}>
                    {supply.category}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Current Stock</label>
                <input 
                  type="number" 
                  required 
                  value={formData.currentStock}
                  onChange={(e) => setFormData({...formData, currentStock: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Reorder Point</label>
                <input 
                  type="number" 
                  required
                  value={formData.reorderPoint}
                  onChange={(e) => setFormData({...formData, reorderPoint: e.target.value})}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Expected Delivery</label>
                <input 
                  type="date" 
                  required
                  value={formData.expectedDelivery}
                  onChange={(e) => setFormData({...formData, expectedDelivery: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="date" 
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                />
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="action-btn primary">
                Add Item
              </button>
              <button type="button" className="action-btn secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-left">
          <h1 className="logo">Code Vortex</h1>
          <div className="nav-links">
            <a href="#" className="active">Dashboard</a>
            <a href="#">Inventory</a>
            <a href="#">Orders</a>
            <a href="#">Predictions</a>
            <a href="#">Reports</a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-content">
        {/* Welcome Banner */}
        <div className="welcome-section">
          <div className="welcome-text">
            <h1>Hello, Mike!</h1>
            <p>Welcome back to your dashboard</p>
          </div>
          <div className="action-buttons">
            <button className="primary-btn" onClick={() => setShowAddModal(true)}>
              <i className="fas fa-plus"></i>
              Add New Item
            </button>
            <button className="secondary-btn" onClick={handleGenerateReport}>
              <i className="fas fa-file-alt"></i>
              Generate Report
            </button>
          </div>
        </div>

        {/* Expiring Soon Section */}
        <div className="section-container">
          <div className="section-header">
            <h2>Expiring Soon</h2>
            <span className="item-count">{expiringMedicines.length} items</span>
          </div>

          <div className="medicines-grid">
            <div className="filters-bar">
              <div className="search-box">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search medicines..." />
              </div>
              <button className="filter-btn">
                <i className="fas fa-filter"></i>
                Filters
              </button>
              <button className="view-btn">
                <i className="fas fa-th-list"></i>
              </button>
            </div>

            <table className="medicines-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Days Left</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {expiringMedicines.map(medicine => (
                  <tr key={medicine.id} onClick={() => setSelectedMedicine(medicine)}>
                    <td>{medicine.name}</td>
                    <td>{medicine.category}</td>
                    <td>{medicine.daysUntilExpiry} days</td>
                    <td>
                      <span className={`status-badge ${medicine.status.toLowerCase()}`}>
                        {medicine.status}
                      </span>
                    </td>
                    <td>
                      <button className="action-btn" onClick={(e) => {
                        e.stopPropagation();
                        setShowModal(true);
                        setSelectedMedicine(medicine);
                      }}>
                        <i className="fas fa-ellipsis-v"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supply Categories Section */}
        <div className="section-container">
          <div className="section-header">
            <h2>Supply Categories</h2>
          </div>
          <div className="supplies-grid">
            {supplies.map(supply => (
              <div key={supply.id} className="supply-card">
                <div className="supply-image">
                  <img src={supply.image} alt={supply.name} />
                </div>
                <h4>{supply.name}</h4>
                <p>{supply.category}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Section */}
        <div className="section-container">
          <div className="section-header">
            <h2>Orders & Predictions</h2>
          </div>
          <div className="orders-tabs">
            <button className="tab-btn active">ACTIVE ORDERS</button>
            <button className="tab-btn">ORDER HISTORY</button>
            <button className="tab-btn">AI PREDICTIONS</button>
          </div>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Expected Delivery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{order.medicine}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderDate}</td>
                  <td>{order.expectedDelivery}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button className="track-btn">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {showModal && selectedMedicine && (
          <MedicineDetailModal 
            medicine={selectedMedicine} 
            onClose={() => setShowModal(false)} 
          />
        )}

        {showAddModal && (
          <AddItemModal 
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddNewItem}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard; 