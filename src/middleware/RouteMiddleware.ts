import { Request, Response, NextFunction } from 'express';
import { Server } from '../Server.js';

export type RouteMiddleware = {
  server?: Server;
  middlewareFunction: (req: Request, res: Response, next: NextFunction) => void;
};