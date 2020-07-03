import { Response } from 'express';
import { WinstonLogger } from './WinstonLogger.js';

type LogAndFailParameters = {
  res: Response;
  message: string;
  httpCode?: number;
  errorCode?: string;
};

export function LogAndFail({ res, message, httpCode, errorCode }: LogAndFailParameters) {
  WinstonLogger.error(`${errorCode ? `[${errorCode}] ` : ''}${message}, returning with HTTP Status ${httpCode ?? 401}`);
  res.status(httpCode ?? 401).json({
    errorCode,
    error: message
  });
}