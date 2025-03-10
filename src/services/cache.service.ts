import NodeCache from "node-cache";
import logger from "../utilities/logger";

export class CacheService {
  constructor(
    private readonly cache: NodeCache = new NodeCache({
      stdTTL: 3600, // 1 hour default TTL
      checkperiod: 600, // Check for expired keys every 10 minutes
    })
  ) {}

  async get<T>(key: string) {
    try {
      const value = this.cache.get<T>(key);
      if (value) {
        logger.info(`Cache hit for key: ${key}`);
      } else {
        logger.info(`Cache miss for key: ${key}`);
      }
      return value || null;
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any, ttl?: number) {
    try {
      if (ttl !== undefined) {
        this.cache.set(key, value, ttl);
      } else {
        this.cache.set(key, value);
      }
      logger.info(`Cached value for key: ${key}`);
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
    }
  }

  async del(key: string) {
    try {
      this.cache.del(key);
      logger.info(`Deleted cache for key: ${key}`);
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
    }
  }

  async flush() {
    try {
      this.cache.flushAll();
      logger.info("Cache flushed");
    } catch (error) {
      logger.error("Cache flush error:", error);
    }
  }
}
