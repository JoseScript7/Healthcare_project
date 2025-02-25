import React, { useState, useEffect } from 'react';
import { getInventoryItems, deleteInventoryItem } from '../../services/inventory.service';
import { useAuth } from '../../contexts/AuthContext';
import ItemDetail from './ItemDetail';
import ItemForm from './ItemForm';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import TransferModal from './TransferModal';
import './styles.css';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTransfer, setShowTransfer] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    expiry: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);
      const data = await getInventoryItems();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteInventoryItem(id);
        loadInventory();
      } catch (error) {
        console.error('Failed to delete item:', error);
      }
    }
  };

  const handleSubmit = () => {
    setIsEditing(false);
    setIsAdding(false);
    loadInventory();
  };

  const handleTransfer = (item) => {
    setSelectedItem(item);
    setShowTransfer(true);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadInventory} />;

  return (
    <div className="inventory-list">
      <div className="inventory-header">
        <h2>Inventory Items</h2>
        {user.role === 'admin' && (
          <button onClick={() => setIsAdding(true)}>Add New Item</button>
        )}
      </div>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search items..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="">All Categories</option>
          <option value="medicines">Medicines</option>
          <option value="supplies">Supplies</option>
          <option value="equipment">Equipment</option>
        </select>
        <label>
          <input
            type="checkbox"
            checked={filters.expiry}
            onChange={(e) => setFilters({ ...filters, expiry: e.target.checked })}
          />
          Show Near Expiry
        </label>
      </div>

      {isAdding && (
        <div className="modal">
          <ItemForm
            onSubmit={handleSubmit}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      )}

      {isEditing && selectedItem && (
        <div className="modal">
          <ItemForm
            item={selectedItem}
            onSubmit={handleSubmit}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      )}

      {selectedItem && !isEditing && (
        <div className="modal">
          <ItemDetail
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        </div>
      )}

      {/* Items List */}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.item_id}>
              <td>{item.name}</td>
              <td>{item.category}</td>
              <td>{item.quantity}</td>
              <td>
                <button onClick={() => handleTransfer(item)}>Transfer</button>
                {user.role === 'admin' && (
                  <>
                    <button onClick={() => {
                      setSelectedItem(item);
                      setIsEditing(true);
                    }}>Edit</button>
                    <button onClick={() => handleDelete(item.item_id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showTransfer && (
        <TransferModal
          item={selectedItem}
          onClose={() => setShowTransfer(false)}
          onSuccess={loadInventory}
        />
      )}
    </div>
  );
}

export default InventoryList; 