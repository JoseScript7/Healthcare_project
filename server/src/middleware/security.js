import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

export const securityMiddleware = [
  helmet(),
  limiter
]; 