import { Request, Response, NextFunction } from 'express';
import { IRouteController } from './IRouteController.js';
import { RouteExposedMethods } from './IExposedMethods.js';
export declare abstract class RestfulController implements IRouteController {
    abstract get baseUrl(): string;
    readonly isRestful: boolean;
    exposedMethods(): RouteExposedMethods;
    abstract index(request: Request, response: Response, next?: NextFunction): void;
    abstract create(request: Request, response: Response, next?: NextFunction): void;
    abstract show(request: Request, response: Response, next?: NextFunction): void;
    abstract update(request: Request, response: Response, next?: NextFunction): void;
    abstract destroy(request: Request, response: Response, next?: NextFunction): void;
}
