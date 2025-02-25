import { Notification, User, Facility } from '../models/index.js';
import { sendEmail } from './email.service.js';
import { Op } from 'sequelize';

export const createNotification = async (data) => {
  const notification = await Notification.create(data);
  
  // If email notification is enabled for this type
  if (data.sendEmail) {
    const user = await User.findByPk(data.user_id);
    await sendEmail({
      to: user.email,
      subject: data.title,
      html: data.message
    });
  }

  return notification;
};

export const getUserNotifications = async (userId) => {
  return await Notification.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    limit: 50
  });
};

export const markNotificationAsRead = async (notificationId) => {
  const notification = await Notification.findByPk(notificationId);
  if (notification) {
    await notification.update({ status: 'read' });
  }
  return notification;
};

export const createLowStockNotification = async (item, facility) => {
  const users = await User.findAll({
    where: {
      facility_id: facility.facility_id,
      role: {
        [Op.in]: ['admin', 'manager']
      }
    }
  });

  const notifications = await Promise.all(users.map(user => 
    createNotification({
      user_id: user.user_id,
      title: 'Low Stock Alert',
      message: `${item.name} is running low on stock at ${facility.name}`,
      type: 'low_stock',
      reference_id: item.item_id,
      reference_type: 'inventory_item',
      sendEmail: true
    })
  ));

  return notifications;
};

export const createExpiryNotification = async (stock, facility) => {
  const users = await User.findAll({
    where: {
      facility_id: facility.facility_id,
      role: {
        [Op.in]: ['admin', 'manager', 'staff']
      }
    }
  });

  const notifications = await Promise.all(users.map(user =>
    createNotification({
      user_id: user.user_id,
      title: 'Expiring Stock Alert',
      message: `${stock.InventoryItem.name} will expire on ${new Date(stock.expiry_date).toLocaleDateString()}`,
      type: 'expiry',
      reference_id: stock.stock_id,
      reference_type: 'stock',
      sendEmail: true
    })
  ));

  return notifications;
};

export const createTransferNotification = async (transfer, recipientId) => {
  return await createNotification({
    user_id: recipientId,
    title: 'New Transfer Request',
    message: `A new transfer request has been created for ${transfer.quantity} units of ${transfer.InventoryItem.name}`,
    type: 'transfer',
    reference_id: transfer.transfer_id,
    reference_type: 'transfer',
    sendEmail: true
  });
}; 