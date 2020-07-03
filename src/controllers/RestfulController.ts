import { Request, Response, NextFunction } from 'express';
import { IRouteController } from './IRouteController.js';
import { RouteExposedMethods } from './IExposedMethods.js';

export abstract class RestfulController implements IRouteController {

  public abstract get baseUrl(): string;
  public readonly isRestful: boolean = true;

  public exposedMethods(): RouteExposedMethods {
    return [
      {
        functionName: 'index',
        url: '',
        httpMethods: ["GET"],
      },
      {
        functionName: "create",
        url: '',
        httpMethods: ["POST"]
      },
      {
        functionName: 'show',
        url: ':id',
        httpMethods: ['GET']
      },
      {
        functionName: 'update',
        url: ':id',
        httpMethods: ['PUT']
      },
      {
        functionName: 'destroy',
        url: ':id',
        httpMethods: ['DELETE']
      }
    ];
  }
  // @GET /baseUrl
  public abstract index(request: Request, response: Response, next?: NextFunction): void;

  // @POST /baseUrl
  public abstract create(request: Request, response: Response, next?: NextFunction): void;

  // @GET /baseUrl/:id
  public abstract show(request: Request, response: Response, next?: NextFunction): void;

  // @PUT /baseUrl/:id
  public abstract update(request: Request, response: Response, next?: NextFunction): void;

  // @DELETE /baseUrl/:id
  public abstract destroy(request: Request, response: Response, next?: NextFunction): void;
}
