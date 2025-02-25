import React, { useState } from 'react';
import { addInventoryItem, updateInventoryItem } from '../../services/inventory.service';

function ItemForm({ item = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    category: item?.category || '',
    description: item?.description || '',
    unit: item?.unit || ''
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (item) {
        await updateInventoryItem(item.item_id, formData);
      } else {
        await addInventoryItem(formData);
      }
      onSubmit();
    } catch (error) {
      setError(error.message || 'Failed to save item');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="item-form">
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
        <label>Category:</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          <option value="medicines">Medicines</option>
          <option value="supplies">Supplies</option>
          <option value="equipment">Equipment</option>
        </select>
      </div>

      <div className="form-group">
        <label>Description:</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label>Unit:</label>
        <input
          type="text"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="submit">{item ? 'Update' : 'Add'} Item</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default ItemForm; 