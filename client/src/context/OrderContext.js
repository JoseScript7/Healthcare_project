import React, { createContext, useContext, useState } from 'react';

const OrderContext = createContext();

export const useOrders = () => useContext(OrderContext);

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      medicineName: 'Lipitor',
      quantity: 100,
      date: '2024-02-20',
      status: 'delivered',
      department: 'cardiology'
    },
    // Add more sample orders here
  ]);

  const addOrder = (newOrder) => {
    setOrders(prev => [...prev, { ...newOrder, id: Date.now() }]);
  };

  const updateOrder = (id, updatedOrder) => {
    setOrders(prev => prev.map(order => 
      order.id === id ? { ...order, ...updatedOrder } : order
    ));
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrder }}>
      {children}
    </OrderContext.Provider>
  );
}; 