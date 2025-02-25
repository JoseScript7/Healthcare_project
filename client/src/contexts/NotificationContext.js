import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { getNotifications, markNotificationAsRead } from '../services/notification.service';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const intervalRef = useRef(null);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => n.status === 'unread').length);
    } catch (error) {
      setError(error.message);
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      setError(null);
      await markNotificationAsRead(notificationId);
      setNotifications(prev => prev.map(n => 
        n.notification_id === notificationId 
          ? { ...n, status: 'read' } 
          : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      setError(error.message);
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadNotifications();

    if (user) {
      intervalRef.current = setInterval(loadNotifications, 60000);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [user, loadNotifications]);

  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    refresh: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 