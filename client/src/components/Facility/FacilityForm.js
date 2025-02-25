import React, { useState } from 'react';
import { createFacility, updateFacility } from '../../services/facility.service';

function FacilityForm({ facility = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: facility?.name || '',
    type: facility?.type || '',
    location: facility?.location || '',
    capacity: facility?.capacity || '',
    status: facility?.status || 'active'
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (facility) {
        await updateFacility(facility.facility_id, formData);
      } else {
        await createFacility(formData);
      }
      onSubmit();
    } catch (error) {
      setError(error.message || 'Failed to save facility');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="facility-form">
      <h3>{facility ? 'Edit Facility' : 'Add New Facility'}</h3>
      
      {error && <div className="error">{error}</div>}

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Type:</label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
        >
          <option value="">Select Type</option>
          <option value="hospital">Hospital</option>
          <option value="clinic">Clinic</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="warehouse">Warehouse</option>
        </select>
      </div>

      <div className="form-group">
        <label>Location:</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Capacity:</label>
        <input
          type="number"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
        />
      </div>

      {facility && (
        <div className="form-group">
          <label>Status:</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      )}

      <div className="form-actions">
        <button type="submit">{facility ? 'Update' : 'Add'} Facility</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default FacilityForm; 