import logger from "./logger";

export interface RetryConfig {
  maxAttempts: number;
  delayMs: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delayMs: 1000,
  backoffMultiplier: 2,
};

export async function withRetry(
  operation: () => Promise<any>,
  {
    maxAttempts = DEFAULT_RETRY_CONFIG.maxAttempts,
    delayMs = DEFAULT_RETRY_CONFIG.delayMs,
    backoffMultiplier = DEFAULT_RETRY_CONFIG.backoffMultiplier,
  }: RetryConfig = DEFAULT_RETRY_CONFIG
) {
  let lastError: Error;
  let attempt = 1;

  while (attempt <= maxAttempts!) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        logger.error({
          message: "Operation failed after all retry attempts",
          error: lastError.message,
          attempt,
          maxAttempts,
        });
        throw lastError;
      }

      logger.warn({
        message: "Operation failed, retrying...",
        error: lastError.message,
        attempt,
        nextRetryMs: delayMs,
      });

      await new Promise((resolve) => setTimeout(resolve, delayMs));
      delayMs *= backoffMultiplier!;
      attempt++;
    }
  }

  throw lastError!;
}
