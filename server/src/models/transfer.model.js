import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Transfer = sequelize.define('Transfer', {
  transfer_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  from_facility_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Facilities',
      key: 'facility_id'
    }
  },
  to_facility_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Facilities',
      key: 'facility_id'
    }
  },
  item_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'InventoryItems',
      key: 'item_id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  requested_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
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

export default Transfer; 