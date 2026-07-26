import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as path from 'path';
import * as fs from 'fs';

const logDirs = ['logs/combined', 'logs/error', 'logs/http'];
logDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const levels: winston.config.AbstractConfigSetLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
};

const colors: winston.config.AbstractConfigSetColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  verbose: 'cyan',
  debug: 'blue',
  silly: 'gray',
};

winston.addColors(colors);

// Shared format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return JSON.stringify({ timestamp, level, message, ...meta });
  })
);

// Logger instance
const logger = winston.createLogger({
  levels,
  format: logFormat,
  transports: [
    // error and above → dedicated error log
    new DailyRotateFile({
      filename: path.join('logs', 'error', '%DATE%.error.log'),
      datePattern: 'MMMM',
      level: 'error',
      format: logFormat,
      maxFiles: '12m',
      createSymlink: true,
      symlinkName: 'current.error.log',
    }),
    // everything → combined log
    new DailyRotateFile({
      filename: path.join('logs', 'combined', '%DATE%.combined.log'),
      datePattern: 'MMMM',
      format: logFormat,
      maxFiles: '12m',
      createSymlink: true,
      symlinkName: 'current.combined.log',
    }),
    // http and below → dedicated http log
    new DailyRotateFile({
      filename: path.join('logs', 'http', '%DATE%.http.log'),
      datePattern: 'MMMM',
      level: 'http',
      format: logFormat,
      maxFiles: '12m',
      createSymlink: true,
      symlinkName: 'current.http.log',
    }),
  ],
});

// Colourised console output in non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple()
      ),
      level: 'silly',
    })
  );
}

// Typed helper functions

export const logError = (message: string, meta?: Record<string, unknown>): void => {
  logger.error(message, meta);
};

export const logWarn = (message: string, meta?: Record<string, unknown>): void => {
  logger.warn(message, meta);
};

export const logInfo = (message: string, meta?: Record<string, unknown>): void => {
  logger.info(message, meta);
};

export const logHttp = (message: string, meta?: Record<string, unknown>): void => {
  logger.http(message, meta);
};

export const logDebug = (message: string, meta?: Record<string, unknown>): void => {
  logger.debug(message, meta);
};

export const logVerbose = (message: string, meta?: Record<string, unknown>): void => {
  logger.verbose(message, meta);
};

export const logSilly = (message: string, meta?: Record<string, unknown>): void => {
  logger.silly(message, meta);
};

export default logger;
