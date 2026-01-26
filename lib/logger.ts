import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

// Configure pino logger
export const logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: isDev
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

// Error capture interface
interface ErrorContext {
  [key: string]: unknown;
}

/**
 * Captures error to logs for AI-friendly debugging
 * In serverless environments, only logs to stdout (no file writes)
 */
export function captureError(error: Error, message: string, context: ErrorContext = {}): void {
  // Log to pino (stdout in serverless, which gets captured by platform logging)
  logger.error({ err: error, ...context }, message);
}

// Convenience methods
export const log = {
  debug: (msg: string, data?: object) => logger.debug(data, msg),
  info: (msg: string, data?: object) => logger.info(data, msg),
  warn: (msg: string, data?: object) => logger.warn(data, msg),
  error: (msg: string, error?: Error, context?: ErrorContext) => {
    if (error) {
      captureError(error, msg, context);
    } else {
      logger.error(context, msg);
    }
  },
};

export default logger;
