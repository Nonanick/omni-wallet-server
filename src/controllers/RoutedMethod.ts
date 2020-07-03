import { Request, Response, NextFunction } from 'express';

export type RoutedMethod = (request: Request, response: Response, next: NextFunction) => any | Promise<any>;