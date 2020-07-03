import { Application } from 'express';
import { OmniAdapter } from './OmniAdapter.js';
import { Server } from '../Server.js';
import { IRouteController } from '../controllers/IRouteController.js';
import { IExposedMethod } from '../controllers/IExposedMethods.js';
declare type BindMethodToExpressParameters = {
    server: Application;
    controler: IRouteController;
    exposedMethod: IExposedMethod;
    httpMethod: 'GET' | 'PUT' | 'POST' | 'DELETE';
};
export declare class ExpressAdapter implements OmniAdapter {
    protected _expressServer: Application;
    protected _server: Server;
    serverPort: number;
    constructor(server: Application);
    boot(): Promise<boolean>;
    start(): void;
    protected useLoggerAsMiddleware(): void;
    protected addControllerToServer(server: Application, controler: IRouteController): void;
    protected bindControllerMethodToExpress({ server, controler, exposedMethod, httpMethod }: BindMethodToExpressParameters): void;
}
export {};
