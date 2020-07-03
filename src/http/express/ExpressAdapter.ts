import { Application } from 'express';
import { OmniAdapter } from '../OmniAdapter.js';
import { Server } from '../../Server.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';
import bodyParser from 'body-parser';
import { ExpressControllerManager } from './ExpressControllerManager.js';

export class ExpressAdapter implements OmniAdapter {

  protected _expressServer: Application;

  protected _controllers: ExpressControllerManager;

  protected _server: Server;

  public serverPort: number = 3000;

  constructor(server: Application) {
    this._expressServer = server;
    this._server = new Server();
    this._controllers = new ExpressControllerManager(this._expressServer, this._server);

    this.initializeExpress();
  }

  private initializeExpress() {
    this._expressServer.use(bodyParser.json());
    this._expressServer.use(bodyParser.urlencoded({ extended: true }));
    this.useLoggerAsMiddleware();
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

}
