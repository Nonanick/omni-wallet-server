import { Logger } from 'winston';
export declare class WinstonLoggerClass {
    private _logger;
    private _requestLogging;
    constructor();
    requestLogger(): Logger;
    logger(): Logger;
    log(...message: any[]): void;
    error(message: string): void;
    warn(message: string, data?: any): void;
    debug(message: string, data?: any): void;
    info(message: string, data?: any): void;
}
export declare const WinstonLogger: WinstonLoggerClass;
