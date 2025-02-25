import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const ScheduledReport = sequelize.define('ScheduledReport', {
  schedule_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'user_id'
    }
  },
  facility_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Facilities',
      key: 'facility_id'
    }
  },
  report_type: {
    type: DataTypes.ENUM('inventory', 'transaction', 'expiry', 'low_stock'),
    allowNull: false
  },
  frequency: {
    type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
    allowNull: false
  },
  format: {
    type: DataTypes.ENUM('excel', 'pdf'),
    defaultValue: 'excel'
  },
  recipients: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  last_run: {
    type: DataTypes.DATE,
    allowNull: true
  },
  next_run: {
    type: DataTypes.DATE,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  parameters: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  underscored: true
});

export default ScheduledReport; 