import { createClient } from 'redis';
import logger from '../utils/logger.js';

const client = createClient({
  url: process.env.REDIS_URL
});

client.on('error', (err) => logger.error('Redis Client Error', err));

export const cacheService = {
  async connect() {
    try {
      await client.connect();
    } catch (error) {
      logger.error('Redis connection failed:', error);
    }
  },

  async get(key) {
    return await client.get(key);
  },

  async set(key, value, expireInSeconds = 3600) {
    await client.set(key, value, {
      EX: expireInSeconds
    });
  },

  async del(key) {
    await client.del(key);
  }
}; 