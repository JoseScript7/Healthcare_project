import React, { useState, useEffect } from 'react';
import { FaSearch, FaBell, FaCalendar, FaFilter, FaDownload } from 'react-icons/fa';
import { useInventory } from '../context/InventoryContext';
import { useOrders } from '../context/OrderContext';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import './Reports.css';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const { inventory } = useInventory();
  const { orders } = useOrders();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSupplies, setFilteredSupplies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  const [sortBy, setSortBy] = useState('quantity');
  const [stockMetrics, setStockMetrics] = useState({
    totalValue: 0,
    nearExpiry: 0,
    turnoverRate: 0
  });

  const userInfo = {
    name: localStorage.getItem('userName') || 'Admin User',
    department: localStorage.getItem('department') || 'Pharmacy',
    location: localStorage.getItem('location') || 'Main Branch',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  // Department colors for the chart
  const departmentColors = {
    cardiology: '#3b82f6',
    neurology: '#10b981',
    pediatrics: '#f59e0b',
    orthopedics: '#ef4444',
    dermatology: '#8b5cf6'
  };

  // Calculate department usage trends
  const calculateDepartmentTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
    const departments = Object.keys(departmentColors);
    
    const data = {
      labels: months,
      datasets: departments.map(dept => ({
        label: dept.charAt(0).toUpperCase() + dept.slice(1),
        data: months.map(() => Math.floor(Math.random() * 300 + 200)), // Replace with actual data
        borderColor: departmentColors[dept],
        backgroundColor: departmentColors[dept],
        tension: 0.4
      }))
    };

    return data;
  };

  // Calculate stock metrics
  useEffect(() => {
    if (!inventory || !orders) return;

    const calculateMetrics = () => {
      // Total stock value
      const totalValue = inventory.reduce((sum, item) => 
        sum + (item.currentStock * item.price), 0);

      // Items near expiry
      const nearExpiry = inventory.filter(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        return daysUntilExpiry <= 30;
      }).length;

      // Stock turnover rate (monthly)
      const monthlyOrders = orders.filter(order => 
        new Date(order.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      );
      const turnoverRate = (monthlyOrders.length / inventory.length).toFixed(1);

      setStockMetrics({
        totalValue,
        nearExpiry,
        turnoverRate
      });
    };

    calculateMetrics();
  }, [inventory, orders]);

  // Process and filter supplies
  useEffect(() => {
    if (!inventory) return;

    const processSupplyData = () => {
      let processed = inventory.map(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );

        const status = daysUntilExpiry <= 30 ? 'expiring-soon' 
          : item.currentStock <= item.reorderPoint ? 'reorder' 
          : 'expiring-later';

        return {
          ...item,
          status,
          height: `${Math.min((item.currentStock / 1000) * 100, 100)}%`
        };
      });

      // Apply filters
      if (selectedDepartment !== 'all') {
        processed = processed.filter(item => item.department === selectedDepartment);
      }

      if (searchTerm) {
        processed = processed.filter(item => 
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply sorting
      switch (sortBy) {
        case 'quantity':
          processed.sort((a, b) => b.currentStock - a.currentStock);
          break;
        case 'expiry':
          processed.sort((a, b) => new Date(a.expiryDate) - new Date(b.expiryDate));
          break;
        case 'value':
          processed.sort((a, b) => (b.currentStock * b.price) - (a.currentStock * a.price));
          break;
        default:
          break;
      }

      setFilteredSupplies(processed);
    };

    processSupplyData();
  }, [inventory, searchTerm, selectedDepartment, sortBy]);

  // Process inventory and orders data to create supply statistics
  useEffect(() => {
    const processSupplyData = () => {
      if (!inventory) return [];

      const suppliesData = inventory.map(item => {
        // Calculate days until expiry
        const expiryDate = new Date(item.expiryDate);
        const today = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

        // Determine status based on stock and expiry
        let status;
        if (daysUntilExpiry <= 30) {
          status = 'expiring-soon';
        } else if (item.currentStock <= item.reorderPoint) {
          status = 'reorder';
        } else {
          status = 'expiring-later';
        }

        // Calculate bar height percentage (max 1000 units = 100%)
        const heightPercentage = Math.min((item.currentStock / 1000) * 100, 100);

        return {
          name: item.name,
          quantity: item.currentStock,
          status,
          height: `${heightPercentage}%`,
          expiryDate: item.expiryDate,
          reorderPoint: item.reorderPoint
        };
      });

      // Sort by quantity for better visualization
      return suppliesData.sort((a, b) => b.quantity - a.quantity);
    };

    const updateNotifications = () => {
      const newNotifications = [];
      
      // Check for low stock items
      inventory.forEach(item => {
        if (item.currentStock <= item.reorderPoint) {
          newNotifications.push({
            id: `stock-${item.id}`,
            message: `Low stock alert: ${item.name} (${item.currentStock} units remaining)`,
            type: 'warning'
          });
        }
      });

      // Check for items expiring soon
      inventory.forEach(item => {
        const daysUntilExpiry = Math.ceil(
          (new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (daysUntilExpiry <= 30) {
          newNotifications.push({
            id: `expiry-${item.id}`,
            message: `Expiring soon: ${item.name} (${daysUntilExpiry} days remaining)`,
            type: 'danger'
          });
        }
      });

      // Add recent order notifications
      orders.slice(0, 5).forEach(order => {
        newNotifications.push({
          id: `order-${order.id}`,
          message: `New order: ${order.medicineName} (${order.quantity} units)`,
          type: 'info'
        });
      });

      setNotifications(newNotifications);
    };

    const processedData = processSupplyData();
    setFilteredSupplies(processedData);
    updateNotifications();

    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      const newProcessedData = processSupplyData();
      setFilteredSupplies(newProcessedData);
      updateNotifications();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [inventory, orders]);

  // Handle search
  useEffect(() => {
    if (!inventory) return;

    const filtered = filteredSupplies.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSupplies(filtered);
  }, [searchTerm]);

  return (
    <div className="reports-container">
      <div className="reports-header">
        <div className="filters-container">
          <div className="search-bar">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search supplies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-filter"
          >
            <option value="all">All Departments</option>
            {Object.keys(departmentColors).map(dept => (
              <option key={dept} value={dept}>
                {dept.charAt(0).toUpperCase() + dept.slice(1)}
              </option>
            ))}
          </select>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="date-filter"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-filter"
          >
            <option value="quantity">Sort by Quantity</option>
            <option value="expiry">Sort by Expiry</option>
            <option value="value">Sort by Value</option>
          </select>
          <button className="export-btn">
            <FaDownload /> Export Report
          </button>
        </div>
      </div>

      <div className="info-section">
        <h2>Info</h2>
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Name ↓</span>
            <span className="info-value">{userInfo.name}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Department ↓</span>
            <span className="info-value">{userInfo.department}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Location ↓</span>
            <span className="info-value">{userInfo.location}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Date ↓</span>
            <span className="info-value">{userInfo.date}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Time ↓</span>
            <span className="info-value">{userInfo.time}</span>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card total-value">
          <h3>Total Stock Value</h3>
          <div className="metric-value">
            ${stockMetrics.totalValue.toLocaleString()}
            <span className="metric-trend">+12% from last month</span>
          </div>
        </div>
        <div className="metric-card near-expiry">
          <h3>Items Near Expiry</h3>
          <div className="metric-value">
            {stockMetrics.nearExpiry}
            <span className="metric-subtitle">Within next 30 days</span>
          </div>
        </div>
        <div className="metric-card turnover">
          <h3>Stock Turnover Rate</h3>
          <div className="metric-value">
            {stockMetrics.turnoverRate}x
            <span className="metric-subtitle">Average per month</span>
          </div>
        </div>
      </div>

      <div className="trends-section">
        <h2>Department Usage Trends</h2>
        <div className="chart-container">
          <Line 
            data={calculateDepartmentTrends()}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: '#f0f0f0'
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              },
              plugins: {
                legend: {
                  position: 'bottom'
                }
              }
            }}
          />
        </div>
      </div>

      <div className="supplies-section">
        <div className="supplies-header">
          <h2>Supplies</h2>
          <div className="supplies-legend">
            <div className="legend-item">
              <span className="dot expiring-later"></span>
              <span>Expiring later supplies</span>
            </div>
            <div className="legend-item">
              <span className="dot expiring-soon"></span>
              <span>Expiring soon supplies</span>
            </div>
            <div className="legend-item">
              <span className="dot reorder"></span>
              <span>Supplies to reorder</span>
            </div>
            <div className="legend-item">
              <span>30 days</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <div className="y-axis">
            <span>1000 pcs</span>
            <span>800 pcs</span>
            <span>600 pcs</span>
            <span>400 pcs</span>
            <span>200 pcs</span>
            <span>0 pcs</span>
          </div>
          <div className="chart">
            {filteredSupplies.map((item, index) => (
              <div key={index} className="chart-column">
                <div className="bar-container">
                  <div 
                    className={`bar ${item.status}`} 
                    style={{ height: item.height }}
                  >
                    <span className="bar-value">{item.quantity} pcs</span>
                  </div>
                </div>
                <span className="bar-label">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="supplies-legend bottom">
          {filteredSupplies.map((item, index) => (
            <div key={index} className="legend-item">
              <span className={`dot ${item.status}`}></span>
              <span>{item.quantity} pcs - {item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 