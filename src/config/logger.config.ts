/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const { combine, timestamp, printf } = winston.format;

const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

const excludeNestSystemLogs = winston.format((info) => {
  const ignoredMessages = [
    'dependencies initialized',
    'Starting Nest application...',
    'Mapped',
    'Controller {',
    'Nest application successfully started',
  ];

  const message = String(info.message); // 💡 cast ke string

  for (const msg of ignoredMessages) {
    if (message.includes(msg)) {
      return false;
    }
  }

  return info;
});

export const loggerConfig: WinstonModuleOptions = {
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    excludeNestSystemLogs(),
    myFormat,
  ),
  transports: [
    new winston.transports.File({
      filename: 'storage/logs/app.log',
      level: 'info',
    }),
    new winston.transports.Console(),
  ],
};
