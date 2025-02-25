import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  database: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '24h'
  },
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM
  },
  ml: {
    serviceUrl: process.env.ML_SERVICE_URL || 'http://localhost:5001/api/ml',
    defaultServiceLevel: 0.95,
    forecastDays: 30
  }
}; 