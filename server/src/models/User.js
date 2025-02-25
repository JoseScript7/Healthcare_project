import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'manager', 'staff'),
    defaultValue: 'staff'
  },
  facility_id: {
    type: DataTypes.UUID,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE
  },
  must_change_password: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  indexes: [
    { unique: true, fields: ['email'] },
    { fields: ['facility_id'] }
  ]
});

export default User; 