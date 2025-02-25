import React, { useState, useEffect } from 'react';
import { getFacilities, deleteFacility } from '../../services/facility.service';
import { useAuth } from '../../contexts/AuthContext';
import FacilityForm from './FacilityForm';
import './styles.css';
import { useNavigate } from 'react-router-dom';

function FacilityList() {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    search: ''
  });

  useEffect(() => {
    loadFacilities();
  }, [filters]);

  const loadFacilities = async () => {
    try {
      setLoading(true);
      const data = await getFacilities(filters);
      setFacilities(data);
    } catch (error) {
      setError('Failed to load facilities');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this facility?')) {
      try {
        await deleteFacility(id);
        loadFacilities();
      } catch (error) {
        setError(error.message || 'Failed to delete facility');
      }
    }
  };

  const handleSubmit = () => {
    setIsAdding(false);
    setSelectedFacility(null);
    loadFacilities();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="facility-list">
      <div className="facility-header">
        <h2>Facilities</h2>
        {user.role === 'admin' && (
          <button onClick={() => setIsAdding(true)}>Add New Facility</button>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search facilities..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="">All Types</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="warehouse">Warehouse</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {isAdding && (
        <div className="modal">
          <FacilityForm onSubmit={handleSubmit} onCancel={() => setIsAdding(false)} />
        </div>
      )}

      {selectedFacility && (
        <div className="modal">
          <FacilityForm
            facility={selectedFacility}
            onSubmit={handleSubmit}
            onCancel={() => setSelectedFacility(null)}
          />
        </div>
      )}

      <div className="facility-grid">
        {facilities.map(facility => (
          <div 
            key={facility.facility_id} 
            className="facility-card"
            onClick={() => navigate(`/facilities/${facility.facility_id}`)}
          >
            <h3>{facility.name}</h3>
            <p><strong>Type:</strong> {facility.type}</p>
            <p><strong>Location:</strong> {facility.location}</p>
            <p><strong>Status:</strong> {facility.status}</p>
            <p><strong>Total Items:</strong> {facility.Stocks?.length || 0}</p>
            
            <div className="facility-actions">
              {user.role === 'admin' && (
                <>
                  <button onClick={() => setSelectedFacility(facility)}>Edit</button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(facility.facility_id);
                    }}
                    className="delete"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FacilityList; 