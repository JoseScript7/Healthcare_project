import React, { useState, useEffect } from 'react';
import { 
  FaBoxOpen, FaChartLine, FaExclamationTriangle, FaArrowUp, 
  FaArrowDown, FaClock, FaBox, FaClipboardCheck, FaTruckMoving, 
  FaExclamationCircle, FaSearch, FaFilter, FaDownload, FaSync,
  FaPlus, FaBell, FaUser, FaCalendarAlt
} from 'react-icons/fa';
import MedicineModal from '../components/MedicineModal';
import './Dashboard.css';

const Dashboard = () => {
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showUpdateStockModal, setShowUpdateStockModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
  };

  const handleUpdateStock = () => {
    setModalType('updateStock');
    setShowModal(true);
  };

  const handlePlaceOrder = (medicine) => {
    // Implement order placement logic
    console.log('Placing order for:', medicine.name);
  };

  const handleViewHistory = (medicine) => {
    // Implement history view logic
    console.log('Viewing history for:', medicine.name);
  };

  const [expiringMedicines] = useState([
    {
      id: 1,
      name: "Amoxicillin 500mg",
      category: "Antibiotics",
      currentStock: 150,
      daysUntilExpiry: 15,
      reorderPoint: 100,
      manufacturer: "PharmaCo Ltd",
      storageLocation: "Shelf A1",
      serialNumber: "AMX500-2024-001",
      expiryDate: "2024-04-01",
      status: "Critical",
      unit: "Tablets",
      tags: ["antibiotic", "prescription"]
    },
    {
      id: 2,
      name: "Paracetamol 650mg",
      category: "Pain Relief",
      currentStock: 300,
      daysUntilExpiry: 30,
      reorderPoint: 200,
      manufacturer: "MediCare Inc",
      storageLocation: "Shelf B2",
      serialNumber: "PCM650-2024-002",
      expiryDate: "2024-04-15",
      status: "Warning",
      unit: "Tablets",
      tags: ["analgesic", "otc"]
    },
    {
      id: 3,
      name: "Insulin Glargine",
      category: "Diabetes",
      currentStock: 50,
      daysUntilExpiry: 45,
      reorderPoint: 30,
      manufacturer: "DiabeCare",
      storageLocation: "Cold Storage 1",
      serialNumber: "INS-2024-003",
      expiryDate: "2024-05-01",
      status: "Warning",
      unit: "Vials",
      tags: ["insulin", "refrigerated"]
    },
    {
      id: 4,
      name: "Azithromycin 250mg",
      category: "Antibiotics",
      currentStock: 80,
      daysUntilExpiry: 20,
      reorderPoint: 60,
      manufacturer: "PharmaCo Ltd",
      storageLocation: "Shelf A2",
      serialNumber: "AZT250-2024-004",
      expiryDate: "2024-04-05",
      status: "Critical",
      unit: "Tablets",
      tags: ["antibiotic", "prescription"]
    },
    {
      id: 5,
      name: "Vitamin D3 Supplements",
      category: "Supplements",
      currentStock: 200,
      daysUntilExpiry: 40,
      reorderPoint: 150,
      manufacturer: "NutriLife",
      storageLocation: "Shelf C1",
      serialNumber: "VTD3-2024-005",
      expiryDate: "2024-04-25",
      status: "Warning",
      unit: "Tablets",
      tags: ["vitamin", "otc"]
    }
  ]);

  const [recentOrders] = useState([
    {
      id: "ORD-2024-001",
      medicine: "Amoxicillin 500mg",
      quantity: 500,
      orderDate: "2024-03-15",
      status: "Processing",
      supplier: "PharmaCo Ltd",
      amount: 2500
    },
    {
      id: "ORD-2024-002",
      medicine: "Insulin Glargine",
      quantity: 100,
      orderDate: "2024-03-14",
      status: "Shipped",
      supplier: "DiabeCare",
      amount: 5000
    },
    {
      id: "ORD-2024-003",
      medicine: "Paracetamol 650mg",
      quantity: 1000,
      orderDate: "2024-03-13",
      status: "Delivered",
      supplier: "MediCare Inc",
      amount: 1500
    }
  ]);

  const [healthTrends] = useState([
    {
      trend: "Seasonal Flu Outbreak",
      impact: "High demand for antipyretics and flu medication",
      recommendation: "Increase stock of Paracetamol and cold medicines",
      confidence: 85,
      timeframe: "Next 2 weeks"
    },
    {
      trend: "Rising Allergies",
      impact: "Increased need for antihistamines",
      recommendation: "Stock up on allergy medications",
      confidence: 78,
      timeframe: "Coming month"
    },
    {
      trend: "Monsoon Season Approaching",
      impact: "Higher risk of water-borne diseases",
      recommendation: "Prepare inventory of antibiotics and ORS",
      confidence: 92,
      timeframe: "Next 3 months"
    }
  ]);

  const supplies = [
    {
      id: 1,
      name: 'Analgesics',
      image: '/images/analgesics.png',
      category: 'Pain Relief'
    },
    {
      id: 2,
      name: 'Antibiotics',
      image: '/images/antibiotics.png',
      category: 'Infection'
    },
    {
      id: 3,
      name: 'Hypoglycemics',
      image: '/images/hypoglycemics.png',
      category: 'Diabetes'
    },
    {
      id: 4,
      name: 'Sedatives',
      image: '/images/sedatives.png',
      category: 'Sleep'
    },
    {
      id: 5,
      name: 'Tranquilizer',
      image: '/images/tranquilizer.png',
      category: 'Anxiety'
    },
    {
      id: 6,
      name: 'Vitamins',
      image: '/images/vitamins.png',
      category: 'Supplements'
    }
  ];

  // Sample data for the dashboard
  const stockSummary = {
    totalItems: {
      value: 2547,
      change: '+12%',
      trend: 'up',
      color: '#4CAF50'
    },
    lowStock: {
      value: 23,
      change: '-5%',
      trend: 'down',
      color: '#FF9800'
    },
    expiringSoon: {
      value: 15,
      change: '+3%',
      trend: 'up',
      color: '#E91E63'
    },
    outOfStock: {
      value: 7,
      change: '-2%',
      trend: 'down',
      color: '#F44336'
    }
  };

  const recentActivity = [
    { 
      id: 1, 
      type: 'New Order', 
      item: 'Amoxicillin', 
      quantity: 500, 
      date: '2024-02-20',
      status: 'Processing',
      icon: <FaClipboardCheck />
    },
    { 
      id: 2, 
      type: 'Stock Update', 
      item: 'Ibuprofen', 
      quantity: -50, 
      date: '2024-02-19',
      status: 'Completed',
      icon: <FaBox />
    },
    { 
      id: 3, 
      type: 'Delivery', 
      item: 'Metformin', 
      quantity: 1000, 
      date: '2024-02-18',
      status: 'In Transit',
      icon: <FaTruckMoving />
    },
    { 
      id: 4, 
      type: 'Expiry Alert', 
      item: 'Paracetamol', 
      quantity: 200, 
      date: '2024-02-17',
      status: 'Urgent',
      icon: <FaExclamationCircle />
    }
  ];

  const stockAlerts = [
    { 
      id: 1, 
      type: 'Low Stock', 
      item: 'Omeprazole', 
      current: 50, 
      threshold: 100,
      urgency: 'medium'
    },
    { 
      id: 2, 
      type: 'Expiring Soon', 
      item: 'Aspirin', 
      expiryDate: '2024-03-15',
      urgency: 'high'
    },
    { 
      id: 3, 
      type: 'Out of Stock', 
      item: 'Metoprolol',
      urgency: 'critical'
    },
    { 
      id: 4, 
      type: 'Low Stock', 
      item: 'Sertraline', 
      current: 30, 
      threshold: 75,
      urgency: 'medium'
    }
  ];

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setNotifications(prev => ([
        { id: Date.now(), message: 'Dashboard data refreshed', type: 'success' },
        ...prev
      ]));
    } catch (error) {
      setNotifications(prev => ([
        { id: Date.now(), message: 'Failed to refresh data', type: 'error' },
        ...prev
      ]));
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const data = {
      stockSummary,
      // Add other data to export
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dashboard-export-${new Date().toISOString()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setNotifications(prev => ([
      { id: Date.now(), message: 'Data exported successfully', type: 'success' },
      ...prev
    ]));
  };

  const handleAddItem = () => {
    setModalType('addItem');
    setShowModal(true);
  };

  const handleGenerateReport = () => {
    setModalType('generateReport');
    setShowModal(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Filter activities and alerts based on search term
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    // Apply filtering logic
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Update data based on selected period
  };

  const handleActionClick = (item) => {
    setSelectedItem(item);
    setModalType('action');
    setShowModal(true);
  };

  // Modal component with proper content handling
  const Modal = ({ type }) => {
    if (!type) return null;

    const modalContent = {
      addItem: {
        title: 'Add New Item',
        content: (
          <form className="modal-form" onSubmit={(e) => {
            e.preventDefault();
            // Add item logic here
            setShowModal(false);
          }}>
            <input type="text" placeholder="Item Name" required />
            <input type="number" placeholder="Quantity" required />
            <input type="text" placeholder="Category" required />
            <input type="number" placeholder="Price" required />
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Add Item</button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )
      },
      updateStock: {
        title: 'Update Stock',
        content: (
          <form className="modal-form" onSubmit={(e) => {
            e.preventDefault();
            // Update stock logic here
            setShowModal(false);
          }}>
            <select required>
              <option value="">Select Item</option>
              <option value="1">Item 1</option>
              <option value="2">Item 2</option>
            </select>
            <input type="number" placeholder="New Quantity" required />
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Update</button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )
      },
      generateReport: {
        title: 'Generate Report',
        content: (
          <form className="modal-form" onSubmit={(e) => {
            e.preventDefault();
            // Generate report logic here
            setShowModal(false);
          }}>
            <div className="date-range">
              <input type="date" required />
              <input type="date" required />
            </div>
            <div className="report-options">
              <label>
                <input type="checkbox" /> Stock Summary
              </label>
              <label>
                <input type="checkbox" /> Transaction History
              </label>
              <label>
                <input type="checkbox" /> Alerts and Notifications
              </label>
            </div>
            <div className="modal-actions">
              <button type="submit" className="btn-primary">Generate</button>
              <button 
                type="button" 
                className="btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )
      },
      action: {
        title: 'Take Action',
        content: selectedItem && (
          <div className="action-modal">
            <div className="item-details">
              <h4>{selectedItem.type}</h4>
              <p>{selectedItem.item}</p>
              {selectedItem.quantity && (
                <p>Quantity: {selectedItem.quantity}</p>
              )}
            </div>
            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={() => {
                  // Handle action logic here
                  setShowModal(false);
                }}
              >
                Confirm Action
              </button>
              <button 
                className="btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )
      }
    };

    const content = modalContent[type];
    if (!content) return null;

    return (
      <div className="modal-overlay" onClick={() => setShowModal(false)}>
        <div 
          className="modal-content"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>{content.title}</h3>
            <button 
              className="close-btn"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            {content.content}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="search-container">
          <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        <div className="top-actions">
          <button 
            className={`notification-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <FaBell />
            {notifications.length > 0 && (
              <span className="notification-badge">{notifications.length}</span>
            )}
          </button>
          <button className="user-btn">
            <FaUser />
          </button>
        </div>
      </div>

      {/* Notification Panel */}
      {showNotifications && (
        <div className="notification-panel">
          <h3>Notifications</h3>
          <div className="notification-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.type}`}
              >
                {notification.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="content-header">
          <h1>Inventory Dashboard</h1>
          <div className="period-selector">
            <FaCalendarAlt />
            <select 
              value={selectedPeriod} 
              onChange={(e) => handlePeriodChange(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="year">This Year</option>
            </select>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <button className="action-btn add" onClick={handleAddItem}>
            <FaPlus />
            Add Item
          </button>
          <button className="action-btn update" onClick={handleUpdateStock}>
            <FaSync />
            Update Stock
          </button>
          <button className="action-btn export" onClick={handleExport}>
            <FaDownload />
            Export Data
          </button>
          <button className="action-btn report" onClick={handleGenerateReport}>
            <FaChartLine />
            Generate Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
        {Object.entries(stockSummary).map(([key, data]) => (
            <div 
              key={key}
              className="stat-card"
            >
              <div className="stat-header">
                <h3>{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <span className={`trend ${data.trend}`}>
                  {data.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                  {data.change}
                </span>
              </div>
              <div className="stat-value">{data.value}</div>
            </div>
        ))}
      </div>

        {/* Recent Activity */}
        <div className="activity-section">
          <div className="section-header">
            <h2>Recent Activity</h2>
            <button className="view-all">View Full History</button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="timeline-item">
                <div className={`timeline-icon ${activity.type.toLowerCase().replace(' ', '-')}`}>
                  {activity.icon}
                </div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <h4>{activity.type}</h4>
                    <span className={`status ${activity.status.toLowerCase()}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="item-name">{activity.item}</p>
                  <div className="timeline-meta">
                    <span className="quantity">Qty: {activity.quantity}</span>
                    <span className="date">{activity.date}</span>
                  </div>
                  <button 
                    className="action-btn"
                    onClick={() => handleActionClick(activity)}
                  >
                    Take Action
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showModal && <Modal type={modalType} />}

      {/* Expiring Medicines Section */}
      <div className="section">
        <h2>Expiring Medicines</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Days Until Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {expiringMedicines.map(medicine => (
                <tr key={medicine.id}>
                  <td onClick={() => handleMedicineClick(medicine)} style={{ cursor: 'pointer' }}>
                    {medicine.name}
                  </td>
                  <td>{medicine.category}</td>
                  <td>{medicine.currentStock} {medicine.unit}</td>
                  <td>{medicine.daysUntilExpiry} days</td>
                  <td>
                    <span className={`status-badge ${medicine.status.toLowerCase()}`}>
                      {medicine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="section">
        <h2>Recent Orders</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Medicine</th>
                <th>Quantity</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.medicine}</td>
                  <td>{order.quantity}</td>
                  <td>{order.orderDate}</td>
                  <td>
                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>${order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Trends Section */}
      <div className="section">
        <h2>Real-Time Health Trends</h2>
        <div className="health-trends">
          {healthTrends.map((trend, index) => (
            <div key={index} className="trend-card">
              <h3>{trend.trend}</h3>
              <p><strong>Impact:</strong> {trend.impact}</p>
              <p><strong>Recommendation:</strong> {trend.recommendation}</p>
              <div className="confidence-meter">
                <div 
                  className="confidence-bar" 
                  style={{width: `${trend.confidence}%`}}
                ></div>
                <span>{trend.confidence}% Confidence</span>
              </div>
              <p className="timeframe">Expected within: {trend.timeframe}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Medicine Modal */}
      {selectedMedicine && (
        <MedicineModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onUpdateStock={handleUpdateStock}
          onPlaceOrder={handlePlaceOrder}
          onViewHistory={handleViewHistory}
        />
      )}
    </div>
  );
};

export default Dashboard; 