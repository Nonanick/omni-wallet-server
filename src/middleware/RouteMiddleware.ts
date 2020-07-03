import { Request, Response, NextFunction } from 'express';
import { Server } from '../Server.js';

export type RouteMiddleware = {
  useServer?: Server;
  middlewareFunction: (req: Request, res: Response, next: NextFunction) => void;
};