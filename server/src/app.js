import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database.js';
import router from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createServer } from 'http';
import { initializeSocket } from './services/socket.service.js';
import compression from 'compression';
import { securityMiddleware } from './middleware/security.js';
import { setupSwagger } from './config/swagger.js';
import logger from './utils/logger.js';
import { cacheService } from './services/cache.service.js';
import { checkDatabaseHealth } from './services/health.service.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(helmet());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(securityMiddleware);

// Routes
app.use('/api', router);

// Basic health check route
app.get('/health', async (req, res) => {
  const dbHealth = await checkDatabaseHealth();
  res.status(dbHealth.status === 'healthy' ? 200 : 500).json({
    status: 'ok',
    database: dbHealth,
    uptime: process.uptime()
  });
});

// Documentation
setupSwagger(app);

// Error handler
app.use(errorHandler);

const server = createServer(app);
initializeSocket(server);

// Initialize services
const initializeApp = async () => {
  try {
    await initializeDatabase();
    await cacheService.connect();
    logger.info('Redis connected');
    
    const port = process.env.PORT || 5000;
    server.listen(port, () => {
      logger.info(`Server running on port ${port}`);
    });
  } catch (error) {
    logger.error('Server initialization error:', error);
    process.exit(1);
  }
};

initializeApp();

export default app; 