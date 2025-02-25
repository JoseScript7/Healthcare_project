import sequelize from '../config/database.js';

export const checkDatabaseHealth = async () => {
  try {
    await sequelize.authenticate();
    const result = await sequelize.query('SELECT 1');
    return {
      status: 'healthy',
      responseTime: result[1].time,
      timestamp: new Date()
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date()
    };
  }
}; 