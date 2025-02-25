import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerPath = path.join(__dirname, '../../docs/swagger.yaml');

export const setupSwagger = (app) => {
  try {
    if (fs.existsSync(swaggerPath)) {
      const swaggerDocument = YAML.load(swaggerPath);
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      logger.info('Swagger documentation initialized');
    } else {
      logger.warn('Swagger documentation file not found, API docs will not be available');
    }
  } catch (error) {
    logger.error('Failed to initialize Swagger:', error);
  }
}; 