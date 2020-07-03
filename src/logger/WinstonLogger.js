import winston from 'winston';
import path from 'path';
export class WinstonLoggerClass {
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
                    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
                    dirname: path.resolve(process.cwd(), 'log'),
                }),
            ],
        });
    }
    requestLogger() {
        return this._requestLogging;
    }
    logger() {
        return this._logger;
    }
    log(...message) {
        this._logger.log('info', message.map((v) => String(v)).join(' '));
    }
    error(message) {
        this._logger.error(message);
    }
    warn(message, data) {
        this._logger.warn(message, data);
    }
    debug(message, data) {
        this._logger.debug(message, data);
    }
    info(message, data) {
        this._logger.info(message, data);
    }
}
export const WinstonLogger = new WinstonLoggerClass();
