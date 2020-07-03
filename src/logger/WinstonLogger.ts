import winston, { Logger } from 'winston';
import path from 'path';

export class WinstonLoggerClass {
  private _logger: Logger;

  private _requestLogging: Logger;

  constructor() {
    this._logger = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'dev_log.log',
          format: winston.format.json(),
          dirname: path.resolve(process.cwd(), 'log'),
        }),
      ],
    });

    this._requestLogging = winston.createLogger({
      transports: [
        new winston.transports.File({
          filename: 'dev_request_log.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
          dirname: path.resolve(process.cwd(), 'log'),
        }),
      ],
    });
  }

  public requestLogger(): Logger {
    return this._requestLogging;
  }

  public logger(): Logger {
    return this._logger;
  }

  public log(...message: any[]) {
    this._logger.log('info', message.map((v) => String(v)).join(' '));
  }

  public error(message: string) {
    this._logger.error(message);
  }

  public warn(message: string, data?: any) {
    this._logger.warn(message, data);
  }

  public debug(message: string, data?: any) {
    this._logger.debug(message, data);
  }

  public info(message: string, data?: any) {
    this._logger.info(message, data);
  }
}

export const WinstonLogger = new WinstonLoggerClass();
