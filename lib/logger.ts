import pino from 'pino';
import fs from 'fs';
import path from 'path';

const isDev = process.env.NODE_ENV !== 'production';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

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

interface CapturedError {
  timestamp: string;
  level: 'error';
  msg: string;
  error: {
    type: string;
    message: string;
    stack?: string;
  };
  context: ErrorContext;
}

/**
 * Captures error to logs/last_error_<timestamp>.json for AI-friendly debugging
 */
export function captureError(error: Error, message: string, context: ErrorContext = {}): void {
  const timestamp = new Date().toISOString();
  const errorData: CapturedError = {
    timestamp,
    level: 'error',
    msg: message,
    error: {
      type: error.name || 'Error',
      message: error.message,
      stack: error.stack,
    },
    context,
  };

  // Log to pino
  logger.error({ err: error, ...context }, message);

  // Write to last_error file for AI debugging
  const filename = `last_error_${timestamp.replace(/:/g, '-')}.json`;
  const filepath = path.join(logsDir, filename);

  try {
    fs.writeFileSync(filepath, JSON.stringify(errorData, null, 2));
  } catch (writeError) {
    logger.error({ err: writeError }, 'Failed to write error file');
  }
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
