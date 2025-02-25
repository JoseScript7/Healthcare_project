import React, { useRef, useEffect, useCallback } from 'react';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function NotificationList({ onClose, onError }) {
  const { notifications, markAsRead, loading } = useNotifications();
  const navigate = useNavigate();
  const listRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (listRef.current && !listRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleNotificationClick = useCallback(async (notification) => {
    try {
      if (notification.status === 'unread') {
        await markAsRead(notification.notification_id);
      }

      // Handle navigation based on notification type and reference
      switch (notification.type) {
        case 'low_stock':
          navigate(`/inventory/${notification.reference_id}`);
          break;
        case 'expiry':
          navigate(`/stock/${notification.reference_id}`);
          break;
        case 'transfer':
          navigate(`/transfers/${notification.reference_id}`);
          break;
        default:
          console.warn('Unknown notification type:', notification.type);
          break;
      }
      onClose();
    } catch (error) {
      console.error('Error handling notification:', error);
      onError(error);
    }
  }, [navigate, markAsRead, onClose, onError]);

  if (loading) {
    return (
      <div className="notification-loading" role="status">
        <span className="sr-only">Loading notifications...</span>
        Loading...
      </div>
    );
  }

  return (
    <div 
      className="notification-list" 
      ref={listRef}
      role="region"
      aria-label="Notifications"
    >
      <div className="notification-header">
        <h3>Notifications</h3>
        <button 
          className="close-button" 
          onClick={onClose}
          aria-label="Close notifications"
        >
          &times;
        </button>
      </div>

      {notifications.length === 0 ? (
        <div className="no-notifications">No notifications</div>
      ) : (
        <div className="notifications-container">
          {notifications.map(notification => (
            <div
              key={notification.notification_id}
              className={`notification-item ${notification.status}`}
              onClick={() => handleNotificationClick(notification)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleNotificationClick(notification);
                }
              }}
            >
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(NotificationList); 