var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Server } from '../Server.js';
import { WinstonLogger } from '../logger/WinstonLogger.js';
import { ServerEvents } from '../ServerEvents.js';
import bodyParser from 'body-parser';
export class ExpressAdapter {
    constructor(server) {
        this.serverPort = 3000;
        this._expressServer = server;
        this._expressServer.use(bodyParser.json());
        this._expressServer.use(bodyParser.urlencoded({ extended: true }));
        this.useLoggerAsMiddleware();
        this._server = new Server();
        this._server.on(ServerEvents.CONTROLLER_ADDED, (controller) => {
            this.addControllerToServer(this._expressServer, controller);
        });
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._server.boot();
        });
    }
    start() {
        this._expressServer.get('/', (req, res, next) => {
            res.json({
                status: 'online',
            });
            next();
        });
        WinstonLogger.info(`Server started, listening on port ${this.serverPort}`);
        this._expressServer.listen(this.serverPort);
    }
    useLoggerAsMiddleware() {
        this._expressServer.use((req, res, next) => {
            WinstonLogger.requestLogger().info(`Request: ${req.method} - '${req.originalUrl}' with ${JSON.stringify(req.params)}`);
            next();
        });
    }
    addControllerToServer(server, controler) {
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
    bindControllerMethodToExpress({ server, controler, exposedMethod, httpMethod }) {
        const routeURL = `/${controler.baseUrl}/${exposedMethod.url}`;
        WinstonLogger.info(`Controller Method added! ${httpMethod} - ${routeURL} is now bound to method ${exposedMethod.functionName}`);
        // same as app.get() | app.put() | app.delete() | app.post()
        server[httpMethod.toLocaleLowerCase()](routeURL, (req, res, next) => {
            const controllerFunction = controler[exposedMethod.functionName];
            if (typeof controllerFunction === "function") {
                controllerFunction(req, res, next);
            }
            else {
                WinstonLogger
                    .error(`Exposed method of controller is not a callable function! 
                ${exposedMethod.functionName} in ${JSON.stringify(controler.exposedMethods())}`);
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
