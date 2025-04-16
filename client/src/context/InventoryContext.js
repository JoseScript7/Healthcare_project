import React, { createContext, useContext, useState } from 'react';

// Create the context
const InventoryContext = createContext(null);

// Sample data generator function
const generateSampleData = () => {
  const categories = [
    'Analgesics', 'Antibiotics', 'Antivirals', 'Cardiovascular',
    'Dermatological', 'Diabetes', 'Gastrointestinal', 'Respiratory'
  ];

  const manufacturers = [
    'Pfizer', 'Novartis', 'Roche', 'Merck', 'GSK', 'Johnson & Johnson',
    'AstraZeneca', 'Sanofi'
  ];

  const medicines = [
    'Aspirin', 'Ibuprofen', 'Paracetamol', 'Amoxicillin', 'Azithromycin',
    'Ciprofloxacin', 'Metformin', 'Omeprazole', 'Lisinopril', 'Metoprolol'
  ];

  return Array.from({ length: 80 }, (_, index) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + Math.floor(Math.random() * 365));
    
    const currentStock = Math.floor(Math.random() * 1000) + 100;
    const reorderPoint = Math.floor(Math.random() * 200) + 50;

    return {
      id: index + 1,
      name: `${medicines[Math.floor(Math.random() * medicines.length)]} ${Math.floor(Math.random() * 500)}mg`,
      category: categories[Math.floor(Math.random() * categories.length)],
      currentStock,
      unit: Math.random() > 0.5 ? 'tablets' : 'bottles',
      manufacturer: manufacturers[Math.floor(Math.random() * manufacturers.length)],
      expiryDate: expiryDate.toISOString().split('T')[0],
      location: `Storage ${String.fromCharCode(65 + Math.floor(Math.random() * 6))}-${Math.floor(Math.random() * 20) + 1}`,
      serialNumber: `SN${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      reorderPoint,
      status: currentStock < reorderPoint ? 'Low Stock' : 'In Stock',
      daysUntilExpiry: Math.ceil((expiryDate - new Date()) / (1000 * 60 * 60 * 24))
    };
  });
};

const generateOrderStatus = () => {
  const statuses = ['Processing', 'Shipped', 'In Transit', 'Delivered', 'Completed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const generateExpectedDelivery = () => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * 14) + 1);
  return date.toISOString().split('T')[0];
};

// Create the provider component
export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState(generateSampleData());
  const [orders, setOrders] = useState([]);

  const addItem = (newItem) => {
    // Add to inventory
    const itemToAdd = {
      ...newItem,
      id: Date.now(),
      status: 'In Stock',
      daysUntilExpiry: Math.ceil((new Date(newItem.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))
    };

    setInventory(prev => [...prev, itemToAdd]);

    // Create corresponding order
    const order = {
      id: Date.now(),
      medicineId: itemToAdd.id,
      medicineName: itemToAdd.name,
      quantity: itemToAdd.currentStock,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: generateExpectedDelivery(),
      status: generateOrderStatus(),
      supplier: itemToAdd.manufacturer
    };

    setOrders(prev => [...prev, order]);
  };

  const updateStock = (medicineId, quantityChange) => {
    setInventory(prev => prev.map(item => {
      if (item.id === medicineId) {
        const newStock = item.currentStock + quantityChange;
        return {
          ...item,
          currentStock: newStock,
          status: newStock < item.reorderPoint ? 'Low Stock' : 'In Stock'
        };
      }
      return item;
    }));
  };

  const placeOrder = (medicineId, orderDetails) => {
    const medicine = inventory.find(item => item.id === medicineId);
    const newOrder = {
      id: Date.now(),
      medicineId,
      medicineName: medicine.name,
      quantity: orderDetails.quantity,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: orderDetails.expectedDelivery,
      status: 'Processing',
      supplier: orderDetails.supplier
    };

    setOrders(prev => [...prev, newOrder]);
  };

  const value = {
    inventory,
    orders,
    addItem,
    updateStock,
    placeOrder,
    setInventory,
    setOrders
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// Create the custom hook
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === null) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}; 
export const useInventoryContext = () => useContext(InventoryContext); 