// config/redis.ts
import { createClient } from 'redis';
import { logger } from '../utils/logger';


export let redisClient: ReturnType<typeof createClient> | null = null;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
      password: process.env.REDIS_PASSWORD,
    });
    
    redisClient.on('error', (err) => {
      logger.error(`Redis error: ${err}`);
    });
    
    redisClient.on('connect', () => {
      logger.info('✅ Redis connected');
    });
    
    await redisClient.connect();
  } catch (error) {
    logger.warn(`Redis connection failed: ${error}. Running without cache.`);
    redisClient = null;
  }
};

export const getCache = async (key: string) => {
  if (!redisClient) return null;
  const data = await redisClient.get(key);
  return data ? JSON.parse(data) : null;
};

export const setCache = async (key: string, value: any, ttl = 3600) => {
  if (!redisClient) return;
  await redisClient.setEx(key, ttl, JSON.stringify(value));
};

export const deleteCache = async (pattern: string) => {
  if (!redisClient) return;
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};