import { Application, Request, Response, NextFunction } from 'express';
import { Server } from '../../Server.js';
import { IRouteController } from '../../controllers/IRouteController.js';
import { ServerEvents } from '../../ServerEvents.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';
import { BindMethodToExpressParameters } from './BindMethodToExpressParameters.js';

export class ExpressControllerManager {

  private _express: Application;

  private _server: Server;

  private _controllers: IRouteController[] = [];

  constructor(express: Application, server: Server) {

    this._express = express;
    this._server = server;

    this._server.on(ServerEvents.CONTROLLER_ADDED, (controller: IRouteController) => {
      this._controllers.push(controller);
      this.addControllerToServer(this._express, controller);
    });

  }

  protected addControllerToServer(server: Application, controler: IRouteController) {
    const methods = controler.exposedMethods();

    methods.forEach((method) => {
      method.httpMethods.forEach((httpMethod) => {
        this.bindControllerMethodToExpress({
          server,
          controler,
          exposedMethod: method,
          httpMethod
        });
      });
    });
  }

  protected bindControllerMethodToExpress({ server, controler, exposedMethod, httpMethod }: BindMethodToExpressParameters) {

    const routeURL = `/${controler.baseUrl}/${exposedMethod.url}`;

    const getPutDeletePost = httpMethod.toLocaleLowerCase();

    // Add Controller middlewares
    controler.middlewares.forEach((middleware) => {
      middleware.useServer = this._server;
      server.use(routeURL, middleware.middlewareFunction.bind(middleware));
    });

    // Add Exposed methods middlewares
    if (exposedMethod.useMiddlewares) {
      exposedMethod.useMiddlewares.forEach((middleware) => {
        middleware.useServer = this._server;
        server.use(routeURL, middleware.middlewareFunction.bind(middleware));
      });
    }

    // same as app.get() | app.put() | app.delete() | app.post()
    (server as any)[getPutDeletePost]
      (
        routeURL,
        (req: Request, res: Response, next: NextFunction) => {
          const controllerFunction = (controler as any)[exposedMethod.functionName];

          if (typeof controllerFunction === "function") {
            controllerFunction(req, res, next);
          } else {
            WinstonLogger
              .error(
                `Exposed method of controller is not a callable function! 
                ${exposedMethod.functionName} in ${JSON.stringify(controler.exposedMethods())}`
              );

            res.status(500)
              .json({
                code: 'SYS.ROUTES.METHOD_NOT_FOUND',
                error: 'Failed to access method!'
              });
            next();
          }
        });

    WinstonLogger.info(`Controller Method added! ${httpMethod} - ${routeURL} is now bound to method ${exposedMethod.functionName}`);
  }

}