import { RouteMiddleware } from '../middleware/RouteMiddleware.js';

export interface IExposedMethod {
  functionName: string;
  url: string;
  requiredParameters?: string[];
  httpMethods: ('GET' | 'PUT' | 'POST' | 'DELETE')[];
  useMiddlewares?: RouteMiddleware[];
}

export type RouteExposedMethods = IExposedMethod[];
