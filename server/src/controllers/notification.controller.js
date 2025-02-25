import {
  getUserNotifications,
  markNotificationAsRead
} from '../services/notification.service.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await getUserNotifications(req.user.user_id);
    res.status(200).json(notifications);
  } catch (error) {
    console.error('Get Notifications Error:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await markNotificationAsRead(req.params.id);
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    console.error('Mark Notification Error:', error);
    res.status(400).json({ error: error.message });
  }
}; 