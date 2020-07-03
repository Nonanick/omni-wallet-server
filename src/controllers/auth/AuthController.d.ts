import { IRouteController } from '../IRouteController.js';
import { RouteExposedMethods } from '../IExposedMethods.js';
export declare class AuthController implements IRouteController {
    readonly baseUrl: string;
    readonly isRestful: boolean;
    exposedMethods(): RouteExposedMethods;
}
