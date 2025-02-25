import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Notification = sequelize.define('Notification', {
  notification_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('low_stock', 'expiry', 'transfer', 'system'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('unread', 'read'),
    defaultValue: 'unread'
  },
  reference_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  reference_type: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

export default Notification; 