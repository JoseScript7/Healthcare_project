import React, { useState } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import AddItemModal from '../components/AddItemModal';
import MedicineModal from '../components/MedicineModal';
import { useInventory } from '../context/InventoryContext';
import './Inventory.css';

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const { inventory, addItem } = useInventory();

  const handleAddItem = (newItem) => {
    addItem(newItem);
    setShowAddModal(false);
  };

  return (
    <div className="inventory-page">
      {/* Header Section */}
      <div className="inventory-header">
        <div className="header-left">
          <h1>Inventory Management</h1>
        </div>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          <FaPlus /> Add Item
        </button>
      </div>

      {/* Search Section */}
      <div className="search-section">
        <div className="search-bar">
          <FaSearch />
          <input
            type="text"
            placeholder="Search by name, category, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="inventory-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Stock</th>
              <th>Expiry Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory
              .filter(item => 
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.location.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(item => (
                <tr key={item.id}>
                  <td className="medicine-name" onClick={() => setSelectedMedicine(item)}>
                    {item.name}
                  </td>
                  <td>{item.category}</td>
                  <td>
                    <span className={item.currentStock < item.reorderPoint ? 'low-stock' : ''}>
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td>{item.expiryDate}</td>
                  <td>{item.location}</td>
                  <td>
                    <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="view-btn"
                      onClick={() => setSelectedMedicine(item)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddItemModal 
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddItem}
        />
      )}

      {selectedMedicine && (
        <MedicineModal
          medicine={selectedMedicine}
          onClose={() => setSelectedMedicine(null)}
        />
      )}
    </div>
  );
};

export default Inventory; 