import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const TransferHistory = sequelize.define('TransferHistory', {
  history_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  transfer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Transfers',
      key: 'transfer_id'
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
    allowNull: false
  },
  action_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  timestamps: true,
  underscored: true
});

export default TransferHistory; 