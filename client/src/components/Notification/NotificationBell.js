import React, { useState } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationList from './NotificationList';
import { FaBell } from 'react-icons/fa';
import './styles.css';

function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const { unreadCount } = useNotifications();

  return (
    <div className="notification-bell-container">
      <button 
        className="notification-bell"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Notifications"
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <NotificationList onClose={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default NotificationBell; 