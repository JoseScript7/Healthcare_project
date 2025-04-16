import React, { useState, useEffect } from 'react';
import { FaBoxes, FaHistory, FaBrain, FaSync, FaMapMarkerAlt, FaChartLine, FaTimes, FaTemperatureHigh, FaCalendarAlt, FaTruckMoving, FaBoxOpen, FaChartBar, FaMicroscope, FaRegChartBar } from 'react-icons/fa';
import './Orders.css';
import MedicineDetailModal from '../components/MedicineDetailModal';

const generateSampleOrders = (count) => {
  const medicines = [
    'Amoxicillin 500mg', 'Lisinopril 10mg', 'Metformin 850mg', 'Omeprazole 20mg',
    'Sertraline 50mg', 'Atorvastatin 40mg', 'Levothyroxine 100mcg', 'Amlodipine 5mg',
    'Gabapentin 300mg', 'Metoprolol 25mg', 'Escitalopram 10mg', 'Losartan 50mg',
    'Vitamin D3 5000IU', 'Pantoprazole 40mg', 'Citalopram 20mg'
  ];

  const suppliers = [
    'PharmaCo Ltd', 'MediSupply Inc', 'GlobalMed', 'HealthCare Distributors',
    'PharmaWorld', 'MedExpress', 'BioPharm Solutions', 'LifeScience Labs'
  ];

  const statuses = ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Pending'];

  return Array.from({ length: count }, (_, index) => ({
    orderId: `ORD-2024-${(index + 1).toString().padStart(3, '0')}`,
    medicine: medicines[Math.floor(Math.random() * medicines.length)],
    quantity: Math.floor(Math.random() * 1000) + 100,
    orderDate: new Date(2024, 0, Math.floor(Math.random() * 90) + 1).toISOString().split('T')[0],
    expectedDelivery: new Date(2024, 1, Math.floor(Math.random() * 90) + 1).toISOString().split('T')[0],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
    amount: Math.floor(Math.random() * 5000) + 500,
    priority: Math.random() > 0.7 ? 'High' : Math.random() > 0.4 ? 'Medium' : 'Low',
    tracking: {
      current: 'In Transit',
      location: 'Distribution Center',
      updates: [
        { date: '2024-02-15', status: 'Order Placed', location: 'Supplier Warehouse' },
        { date: '2024-02-16', status: 'Processing', location: 'Packaging Center' },
        { date: '2024-02-18', status: 'Shipped', location: 'Distribution Hub' },
        { date: '2024-02-20', status: 'In Transit', location: 'Local Facility' }
      ]
    }
  }));
};

const generateHealthTrends = () => {
  return {
    localOutbreaks: [
      {
        disease: 'Seasonal Flu',
        intensity: 'High',
        affectedAreas: ['Urban Centers', 'Schools'],
        trend: 'Increasing',
        relatedMedicines: ['Oseltamivir', 'Antipyretics'],
        preventiveMeasures: ['Vaccination', 'Hand Hygiene']
      },
      {
        disease: 'Allergic Rhinitis',
        intensity: 'Moderate',
        affectedAreas: ['Suburban Areas', 'Parks'],
        trend: 'Stable',
        relatedMedicines: ['Antihistamines', 'Nasal Sprays'],
        preventiveMeasures: ['Air Purification', 'Pollen Avoidance']
      }
    ],
    weatherImpact: {
      temperature: '28°C',
      humidity: '65%',
      airQuality: 'Moderate',
      pollenCount: 'High',
      healthRisks: ['Respiratory Issues', 'Heat Stress']
    },
    demographicTrends: {
      ageGroups: {
        'Under 18': { commonConditions: ['Viral Infections', 'Allergies'] },
        '18-40': { commonConditions: ['Stress-related', 'Digestive Issues'] },
        '40-60': { commonConditions: ['Hypertension', 'Diabetes'] },
        'Over 60': { commonConditions: ['Arthritis', 'Cardiovascular'] }
      }
    }
  };
};

// OrderDetailModal Component
const OrderDetailModal = ({ order, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Order Details</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="modal-body">
          <div className="order-info">
            <h3>Order Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Order ID</label>
                <span>{order.orderId}</span>
              </div>
              <div className="info-item">
                <label>Medicine</label>
                <span>{order.medicine}</span>
              </div>
              <div className="info-item">
                <label>Quantity</label>
                <span>{order.quantity}</span>
              </div>
              <div className="info-item">
                <label>Amount</label>
                <span>${order.amount}</span>
              </div>
              <div className="info-item">
                <label>Supplier</label>
                <span>{order.supplier}</span>
              </div>
              <div className="info-item">
                <label>Status</label>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          
          <div className="tracking-timeline">
            <h3>Tracking Information</h3>
            <div className="timeline">
              {order.tracking.updates.map((update, index) => (
                <div key={index} className="timeline-item">
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h4>{update.status}</h4>
                    <p>{update.location}</p>
                    <span className="timeline-date">{update.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [healthTrends, setHealthTrends] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [aiInsights, setAiInsights] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('month');
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  // AI Predictions and Insights
  const aiPredictions = [
    {
      id: 1,
      medicine: "Paracetamol 500mg",
      predictedDemand: 1500,
      confidence: 89,
      factors: [
        { type: "Seasonal", impact: "High", detail: "Monsoon season approaching - fever cases expected to rise" },
        { type: "Historical", impact: "Medium", detail: "20% increase in demand during similar period last year" },
        { type: "Environmental", impact: "High", detail: "Predicted rainfall in next 2 weeks" }
      ],
      recommendedAction: "Increase stock by 40%"
    },
    {
      id: 2,
      medicine: "Azithromycin 250mg",
      predictedDemand: 800,
      confidence: 92,
      factors: [
        { type: "Disease Outbreak", impact: "High", detail: "Recent respiratory infections in nearby areas" },
        { type: "Weather", impact: "Medium", detail: "Dropping temperatures increase risk of infections" },
        { type: "Population", impact: "Low", detail: "Increased patient registration in local clinics" }
      ],
      recommendedAction: "Place order for 1000 units"
    },
    // Add more AI predictions
  ];

  // Filter orders based on status
  const activeOrdersFiltered = activeOrders.filter(order => 
    ['Processing', 'Shipped', 'In Transit'].includes(order.status)
  );

  const orderHistoryFiltered = activeOrders.filter(order => 
    ['Delivered', 'Completed'].includes(order.status)
  );

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setHealthTrends(generateHealthTrends());
  };

  const refreshTrends = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setHealthTrends(generateHealthTrends());
    setIsRefreshing(false);
  };

  // Generate sample active orders and order history
  useEffect(() => {
    const medicines = [
      'Amoxicillin', 'Ibuprofen', 'Paracetamol', 'Omeprazole', 'Metformin',
      'Lisinopril', 'Amlodipine', 'Metoprolol', 'Simvastatin', 'Sertraline'
    ];
    const suppliers = ['PharmaCorp', 'MediSupply', 'HealthDirect', 'GlobalMeds', 'CareMeds'];
    
    // Generate active orders
    const generateActiveOrders = () => {
      return Array.from({ length: 50 }, (_, i) => ({
        id: `AO${i + 1}`,
        medicine: medicines[Math.floor(Math.random() * medicines.length)],
        quantity: Math.floor(Math.random() * 1000) + 100,
        amount: Math.floor(Math.random() * 10000) + 1000,
        orderDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        expectedDelivery: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: ['Processing', 'In Transit', 'Out for Delivery'][Math.floor(Math.random() * 3)],
        supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
        priority: Math.random() < 0.3 ? 'High' : Math.random() < 0.6 ? 'Medium' : 'Low',
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      }));
    };

    // Generate order history
    const generateOrderHistory = () => {
      return Array.from({ length: 100 }, (_, i) => {
        const orderDate = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
        const deliveryDate = new Date(orderDate.getTime() + (Math.floor(Math.random() * 7) + 2) * 24 * 60 * 60 * 1000);
        
        return {
          id: `HO${i + 1}`,
          medicine: medicines[Math.floor(Math.random() * medicines.length)],
          quantity: Math.floor(Math.random() * 1000) + 100,
          amount: Math.floor(Math.random() * 10000) + 1000,
          orderDate: orderDate.toISOString().split('T')[0],
          deliveryDate: deliveryDate.toISOString().split('T')[0],
          status: 'Delivered',
          supplier: suppliers[Math.floor(Math.random() * suppliers.length)],
          batchNumber: `B${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          qualityCheck: Math.random() > 0.1 ? 'Passed' : 'Conditional Pass',
          temperature: (Math.random() * 5 + 15).toFixed(1),
          humidity: Math.floor(Math.random() * 20 + 40)
        };
      }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    };

    setActiveOrders(generateActiveOrders());
    setOrderHistory(generateOrderHistory());
  }, []);

  // Generate AI insights when timeframe changes
  useEffect(() => {
    const generateAIInsights = () => {
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const seasons = ['Winter', 'Spring', 'Summer', 'Fall'];
      const currentSeason = seasons[Math.floor(currentMonth / 3) % 4];

      return {
        demandPredictions: {
          title: 'Advanced Demand Forecast Analysis',
          methodology: 'Using LSTM Neural Network with Multi-variable Analysis',
          predictions: [
            {
              medicine: 'Amoxicillin',
              predictedDemand: {
                nextMonth: Math.floor(Math.random() * 500) + 1000,
                nextQuarter: Math.floor(Math.random() * 1500) + 3000,
                nextYear: Math.floor(Math.random() * 5000) + 12000
              },
              confidence: 94.5,
              trend: 'increasing',
              factors: [
                { name: 'Seasonal Pattern', impact: 0.35, trend: 'positive' },
                { name: 'Historical Usage', impact: 0.45, trend: 'stable' },
                { name: 'Market Trends', impact: 0.20, trend: 'positive' }
              ]
            }
          ]
        },
        marketIntelligence: {
          title: 'Market Intelligence & Pricing Analytics',
          marketShare: {
            value: (Math.random() * 15 + 25).toFixed(1) + '%',
            trend: 'increasing',
            competitors: [
              { name: 'Competitor A', share: '30%' },
              { name: 'Competitor B', share: '25%' },
              { name: 'Others', share: '20%' }
            ]
          },
          priceAnalysis: {
            averagePrice: '$45.99',
            priceRange: '$39.99 - $52.99',
            recommendations: [
              {
                type: 'Price Optimization',
                suggestion: 'Consider 5% price increase in Q3',
                impact: 'Potential 8% revenue growth'
              }
            ]
          }
        },
        supplyChain: {
          title: 'Supply Chain Analytics',
          metrics: {
            averageLeadTime: '5.3 days',
            stockoutRate: '2.1%',
            fulfillmentRate: '97.8%'
          },
          recommendations: [
            {
              area: 'Inventory Management',
              action: 'Optimize safety stock levels',
              impact: 'Reduce holding costs by 12%'
            }
          ]
        },
        riskAnalysis: {
          title: 'Risk Assessment',
          factors: [
            {
              category: 'Supply Chain',
              level: 'Medium',
              probability: '15%',
              impact: 'High',
              mitigation: 'Diversify supplier base'
            }
          ]
        }
      };
    };

    setAiInsights(generateAIInsights());
  }, [selectedTimeframe]);

  // Enhanced medicine data generation
  const generateMedicineDetails = (medicineName) => {
    const manufacturers = {
      'Amoxicillin': 'GlaxoSmithKline',
      'Ibuprofen': 'Pfizer',
      'Paracetamol': 'Johnson & Johnson',
      'Omeprazole': 'AstraZeneca',
      'Metformin': 'Novartis',
      'Lisinopril': 'Merck',
      'Amlodipine': 'Pfizer',
      'Metoprolol': 'AstraZeneca',
      'Simvastatin': 'Merck',
      'Sertraline': 'Pfizer'
    };

    const today = new Date();
    const expiryDate = new Date(today.getTime() + (Math.floor(Math.random() * 365) + 1) * 24 * 60 * 60 * 1000);
    const daysUntilExpiry = Math.floor((expiryDate - today) / (1000 * 60 * 60 * 24));

    return {
      name: medicineName,
      currentStock: Math.floor(Math.random() * 1000) + 100,
      daysUntilExpiry,
      reorderPoint: Math.floor(Math.random() * 200) + 50,
      manufacturer: manufacturers[medicineName],
      serialNumber: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      storageLocation: `Storage ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(Math.random() * 10) + 1}`,
      expiryDate: expiryDate.toISOString().split('T')[0],
      category: ['Antibiotics', 'Painkillers', 'Cardiovascular', 'Antidiabetic'][Math.floor(Math.random() * 4)],
      stockStatus: daysUntilExpiry < 30 ? 'Low Stock' : 'In Stock'
    };
  };

  // Handle medicine click
  const handleMedicineClick = (medicineName) => {
    const medicineDetails = generateMedicineDetails(medicineName);
    setSelectedMedicine(medicineDetails);
  };

  // Update your table rows to include click handlers
  const renderOrderRow = (order) => (
    <tr key={order.id}>
      <td>{order.id}</td>
      <td>
        <button 
          className="medicine-link"
          onClick={() => handleMedicineClick(order.medicine)}
        >
          {order.medicine}
        </button>
      </td>
      <td>{order.quantity}</td>
      <td>{order.amount.toLocaleString()}</td>
      <td>{order.orderDate}</td>
      <td>{order.expectedDelivery || 'N/A'}</td>
      <td>
        <span className={`status-badge ${order.status.toLowerCase()}`}>
          {order.status}
        </span>
      </td>
      <td>{order.supplier}</td>
      <td>
        <span className={`priority-badge ${order.priority.toLowerCase()}`}>
          {order.priority}
        </span>
      </td>
      <td>{order.trackingNumber}</td>
    </tr>
  );

  const renderOrderTable = (ordersList) => (
    <table className="orders-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Medicine</th>
          <th>Quantity</th>
          <th>Amount</th>
          <th>Order Date</th>
          <th>Expected Delivery</th>
          <th>Status</th>
          <th>Supplier</th>
          <th>Priority</th>
          <th>Tracking</th>
        </tr>
      </thead>
      <tbody>
        {ordersList.map(order => renderOrderRow(order))}
      </tbody>
    </table>
  );

  const renderAIInsights = () => {
    if (!aiInsights) return <div>Loading insights...</div>;

    return (
      <div className="ai-insights-container">
        {/* Demand Predictions */}
        <div className="insight-card">
          <h3><FaChartLine /> {aiInsights.demandPredictions.title}</h3>
          <div className="methodology">
            <FaMicroscope /> {aiInsights.demandPredictions.methodology}
          </div>
          {aiInsights.demandPredictions.predictions.map((pred, idx) => (
            <div key={idx} className="prediction-detail">
              <h4>{pred.medicine}</h4>
              <div className="forecast-periods">
                <div className="period">
                  <span>Next Month</span>
                  <strong>{pred.predictedDemand.nextMonth}</strong>
                </div>
                <div className="period">
                  <span>Next Quarter</span>
                  <strong>{pred.predictedDemand.nextQuarter}</strong>
                </div>
                <div className="period">
                  <span>Next Year</span>
                  <strong>{pred.predictedDemand.nextYear}</strong>
                </div>
              </div>
              <div className="confidence">
                Confidence: {pred.confidence}%
                <div className="confidence-bar" style={{width: `${pred.confidence}%`}} />
              </div>
            </div>
          ))}
        </div>

        {/* Market Intelligence */}
        <div className="insight-card">
          <h3><FaRegChartBar /> {aiInsights.marketIntelligence.title}</h3>
          <div className="market-share">
            <h4>Market Share Analysis</h4>
            <div className="share-chart">
              {aiInsights.marketIntelligence.marketShare.competitors.map((competitor, idx) => (
                <div key={idx} className="share-bar">
                  <div className="bar" style={{width: competitor.share}}>
                    <span>{competitor.name}: {competitor.share}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="price-analysis">
            <h4>Price Analysis</h4>
            <div className="price-metrics">
              <div>Average Price: {aiInsights.marketIntelligence.priceAnalysis.averagePrice}</div>
              <div>Range: {aiInsights.marketIntelligence.priceAnalysis.priceRange}</div>
            </div>
          </div>
        </div>

        {/* Supply Chain Analytics */}
        <div className="insight-card">
          <h3><FaTruckMoving /> {aiInsights.supplyChain.title}</h3>
          <div className="metrics-grid">
            <div className="metric">
              <label>Average Lead Time</label>
              <div className="value">{aiInsights.supplyChain.metrics.averageLeadTime}</div>
            </div>
            <div className="metric">
              <label>Stock-out Rate</label>
              <div className="value">{aiInsights.supplyChain.metrics.stockoutRate}</div>
            </div>
            <div className="metric">
              <label>Fulfillment Rate</label>
              <div className="value">{aiInsights.supplyChain.metrics.fulfillmentRate}</div>
            </div>
          </div>
        </div>

        {/* Risk Analysis */}
        <div className="insight-card">
          <h3><FaBrain /> {aiInsights.riskAnalysis.title}</h3>
          <div className="risk-grid">
            {aiInsights.riskAnalysis.factors.map((risk, idx) => (
              <div key={idx} className="risk-card">
                <h4>{risk.category}</h4>
                <div className={`risk-level ${risk.level.toLowerCase()}`}>
                  Level: {risk.level}
                </div>
                <div className="risk-details">
                  <div>Probability: {risk.probability}</div>
                  <div>Impact: {risk.impact}</div>
                </div>
                <div className="mitigation">
                  Mitigation: {risk.mitigation}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleUpdateStock = (medicineId, updateDetails) => {
    // Update the stock in your state
    setActiveOrders(prevOrders => 
      prevOrders.map(order => {
        if (order.medicine === selectedMedicine.name) {
          const newStock = updateDetails.action === 'add' 
            ? selectedMedicine.currentStock + updateDetails.quantity
            : selectedMedicine.currentStock - updateDetails.quantity;
          
          return {
            ...order,
            currentStock: newStock
          };
        }
        return order;
      })
    );

    // Show success message
    alert(`Stock successfully ${updateDetails.action}ed by ${updateDetails.quantity} units`);
  };

  const handlePlaceOrder = (medicineId, orderDetails) => {
    // Add new order to active orders
    const newOrder = {
      id: `AO${activeOrders.length + 1}`,
      medicine: selectedMedicine.name,
      quantity: orderDetails.quantity,
      amount: orderDetails.quantity * 10, // Sample price calculation
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: orderDetails.expectedDelivery.split('T')[0],
      status: 'Processing',
      supplier: orderDetails.supplier,
      priority: orderDetails.priority,
      trackingNumber: `TRK${Math.random().toString(36).substr(2, 8).toUpperCase()}`
    };

    setActiveOrders(prevOrders => [...prevOrders, newOrder]);
    
    // Show success message
    alert('New order placed successfully');
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Orders Management</h1>
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button 
            className={`tab ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            Order History ({orderHistory.length})
          </button>
          <button 
            className={`tab ${activeTab === 'insights' ? 'active' : ''}`}
            onClick={() => setActiveTab('insights')}
          >
            AI Insights
          </button>
        </div>
      </div>

      <div className="orders-content">
        {activeTab === 'active' && (
          <div className="active-orders">
            {renderOrderTable(activeOrdersFiltered)}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="order-history">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Medicine</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Order Date</th>
                  <th>Delivery Date</th>
                  <th>Status</th>
                  <th>Supplier</th>
                  <th>Batch No.</th>
                  <th>Quality Check</th>
                  <th>Storage Conditions</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <button 
                        className="medicine-link"
                        onClick={() => handleMedicineClick(order.medicine)}
                      >
                        {order.medicine}
                      </button>
                    </td>
                    <td>{order.quantity}</td>
                    <td>${order.amount.toLocaleString()}</td>
                    <td>{order.orderDate}</td>
                    <td>{order.deliveryDate}</td>
                    <td>
                      <span className="status-badge delivered">
                        {order.status}
                      </span>
                    </td>
                    <td>{order.supplier}</td>
                    <td>{order.batchNumber}</td>
                    <td>
                      <span className={`quality-badge ${order.qualityCheck.toLowerCase().replace(' ', '-')}`}>
                        {order.qualityCheck}
                      </span>
                    </td>
                    <td>
                      <span className="storage-conditions">
                        {order.temperature}°C / {order.humidity}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'insights' && renderAIInsights()}
      </div>

      {selectedOrder && (
        <OrderDetailModal 
          order={selectedOrder} 
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {selectedMedicine && (
        <MedicineDetailModal 
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
          onUpdateStock={handleUpdateStock}
          onPlaceOrder={handlePlaceOrder}
        />
      )}
    </div>
  );
};

export default Orders; 