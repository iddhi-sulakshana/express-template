import winston from 'winston';
import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';
import './morgan.config';
import { __dirname } from '@/utils/path.util';

export default function configLogger() {
  // Define log colors for different log levels
  const colors = {
    error: '\x1b[31m', // Red
    warn: '\x1b[33m', // Yellow
    info: '\x1b[36m', // Cyan
    debug: '\x1b[32m', // Green
    reset: '\x1b[0m', // Reset to default color
  };

  // Add console transport for logging to the console
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        // Include timestamp in logs
        winston.format.timestamp({
          format: () => {
            return `[${format(new Date(), 'yyyy-MM-dd:HH.mm.ss.SSS')}]`;
          },
        }),

        // Customize log format with colors and structured output
        winston.format.printf((log) => {
          // @ts-ignore
          const color = colors[log.level] || colors.info;
          if (log.level === 'error') {
            return `${log.timestamp} ${color}[${log.level.toUpperCase()}] : ${
              log.message
            }${colors.reset}`;
          }
          return `${colors.reset}${
            log.timestamp
          } ${color}[${log.level.toUpperCase()}]${colors.reset} : ${log.message}`;
        }),
      ),
    }),
  );

  // thrown exceptions logging for files
  winston.exceptions.handle(
    new winston.transports.File({
      filename: './logs/exceptions.log',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => format(new Date(), 'yyyy-MM-dd:HH.mm.ss.SSS'),
        }),
        winston.format.json(),
      ),
    }),
  );
  // Add a file transport for regular logs
  winston.add(
    new winston.transports.File({
      filename: './logs/logfile.log',
      format: winston.format.combine(
        winston.format.timestamp({
          format: () => format(new Date(), 'yyyy-MM-dd:HH.mm.ss.SSS'),
        }),
        winston.format.json(), // Structured JSON logs
      ),
    }),
  );

  return winston;
}

export function logRequestStream() {
  try {
    const logDir = path.join(__dirname, '../../../../logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    const accessLogStream = fs.createWriteStream(path.join(logDir, 'access.log'), { flags: 'a' });

    return {
      write: (message: string) => {
        const details = JSON.parse(message);
        const requestColor = '\x1b[34m'; // Blue color
        const resetColor = '\x1b[0m'; // Reset color
        const detailedMessage = `[${details.time}] ${requestColor}[RESPONSE]${resetColor} : ${details.method} ${details.status} ${details.url} ${details.contentLength} - ${details.responseTime} | ${details.remoteAddr} ${details.userAgent}\n`;
        accessLogStream.write(message);
        process.stdout.write(detailedMessage);
      },
    };
  } catch (error) {
    winston.error('Error initializing log request stream', error);
  }
}
