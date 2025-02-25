import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFacilityById } from '../../services/facility.service';
import { getInventoryItems } from '../../services/inventory.service';
import StockManagement from './StockManagement';
import { useAuth } from '../../contexts/AuthContext';
import UserManagement from './UserManagement';

function FacilityDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [facility, setFacility] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);

  useEffect(() => {
    loadFacilityData();
  }, [id]);

  const loadFacilityData = async () => {
    try {
      setLoading(true);
      const [facilityData, inventoryData] = await Promise.all([
        getFacilityById(id),
        getInventoryItems()
      ]);
      setFacility(facilityData);
      setInventory(inventoryData);
    } catch (error) {
      setError('Failed to load facility data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!facility) return <div>Facility not found</div>;

  return (
    <div className="facility-detail">
      <div className="facility-detail-header">
        <h2>{facility.name}</h2>
        <div className="facility-info">
          <p><strong>Type:</strong> {facility.type}</p>
          <p><strong>Location:</strong> {facility.location}</p>
          <p><strong>Status:</strong> {facility.status}</p>
          <p><strong>Capacity:</strong> {facility.capacity}</p>
        </div>
      </div>

      <div className="stock-section">
        <div className="section-header">
          <h3>Current Stock</h3>
          {(user.role === 'admin' || user.facility_id === facility.facility_id) && (
            <button onClick={() => setShowStockModal(true)}>
              Manage Stock
            </button>
          )}
        </div>

        <div className="stock-grid">
          {facility.Stocks?.map(stock => (
            <div key={stock.stock_id} className="stock-card">
              <h4>{stock.InventoryItem?.name}</h4>
              <p><strong>Quantity:</strong> {stock.quantity}</p>
              <p><strong>Batch:</strong> {stock.batch_number}</p>
              <p>
                <strong>Expiry:</strong> 
                {new Date(stock.expiry_date).toLocaleDateString()}
              </p>
              <div className={`status ${isNearExpiry(stock.expiry_date) ? 'warning' : ''}`}>
                {isNearExpiry(stock.expiry_date) ? 'Near Expiry' : 'OK'}
              </div>
            </div>
          ))}
        </div>

        {showStockModal && (
          <div className="modal">
            <StockManagement
              facility={facility}
              inventory={inventory}
              onClose={() => setShowStockModal(false)}
              onUpdate={loadFacilityData}
            />
          </div>
        )}
      </div>

      {(user.role === 'admin' || user.role === 'manager') && (
        <div className="user-section">
          <UserManagement facility={facility} />
        </div>
      )}
    </div>
  );
}

const isNearExpiry = (date) => {
  const expiryDate = new Date(date);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
  return expiryDate <= thirtyDaysFromNow;
};

export default FacilityDetail; 