import { Request, Response, NextFunction } from 'express';
export declare abstract class RestfulController {
    abstract index(request: Request, response: Response, next?: NextFunction): void;
    abstract create(request: Request, response: Response, next?: NextFunction): void;
    abstract show(request: Request, response: Response, next?: NextFunction): void;
    abstract update(request: Request, response: Response, next?: NextFunction): void;
    abstract destroy(request: Request, response: Response, next?: NextFunction): void;
}
