import { Application, Request, Response, NextFunction, urlencoded } from 'express';
import { OmniAdapter } from './OmniAdapter.js';
import { Server } from '../Server.js';
import { WinstonLogger } from '../logger/WinstonLogger.js';
import { ServerEvents } from '../ServerEvents.js';
import { IRouteController } from '../controllers/IRouteController.js';
import { IExposedMethod } from '../controllers/IExposedMethods.js';
import bodyParser from 'body-parser';

type BindMethodToExpressParameters = {
  server: Application;
  controler: IRouteController;
  exposedMethod: IExposedMethod;
  httpMethod: 'GET' | 'PUT' | 'POST' | 'DELETE';
};

export class ExpressAdapter implements OmniAdapter {
  protected _expressServer: Application;

  protected _server: Server;

  public serverPort: number = 3000;

  constructor(server: Application) {
    this._expressServer = server;

    this._expressServer.use(bodyParser.json());
    this._expressServer.use(bodyParser.urlencoded({ extended: true }));
    this.useLoggerAsMiddleware();

    this._server = new Server();

    this._server.on(ServerEvents.CONTROLLER_ADDED, (controller: IRouteController) => {
      this.addControllerToServer(this._expressServer, controller);
    });
  }

  public async boot(): Promise<boolean> {
    return this._server.boot();
  }

  public start() {

    this._expressServer.get('/', (req, res, next) => {
      res.json({
        status: 'online',
      });
      next();
    });

    WinstonLogger.info(`Server started, listening on port ${this.serverPort}`);

    this._expressServer.listen(this.serverPort);
  }

  protected useLoggerAsMiddleware() {

    this._expressServer.use((req, res, next) => {
      WinstonLogger.requestLogger().info(
        `Request: ${req.method} - '${req.originalUrl}' with ${JSON.stringify(req.params)}`,
      );
      next();
    });
  }

  protected addControllerToServer(server: Application, controler: IRouteController) {
    const methods = controler.exposedMethods();
    methods.forEach((method) => {
      method.httpMethods.forEach((httpMethod) => {
        this.bindControllerMethodToExpress(
          {
            server,
            controler,
            exposedMethod: method,
            httpMethod
          }
        );
      });
    });
  }

  protected bindControllerMethodToExpress({ server, controler, exposedMethod, httpMethod }: BindMethodToExpressParameters) {

    const routeURL = `/${controler.baseUrl}/${exposedMethod.url}`;

    WinstonLogger.info(`Controller Method added! ${httpMethod} - ${routeURL} is now bound to method ${exposedMethod.functionName}`);

    // same as app.get() | app.put() | app.delete() | app.post()
    (server as any)[httpMethod.toLocaleLowerCase()]
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
  }
}
