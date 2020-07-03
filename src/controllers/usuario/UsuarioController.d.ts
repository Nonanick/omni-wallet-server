import { IRouteController } from '../IRouteController.js';
import { RestfulController } from '../RestfulController.js';
import { NextFunction, Request, Response } from 'express';
export declare class UsuarioController extends RestfulController implements IRouteController {
    readonly baseUrl: string;
    index(request: Request, response: Response, next?: NextFunction): void;
    create(request: Request, response: Response, next?: NextFunction): void;
    show(request: Request, response: Response, next?: NextFunction): void;
    update(request: Request, response: Response, next?: NextFunction): void;
    destroy(request: Request, response: Response, next?: NextFunction): void;
}
