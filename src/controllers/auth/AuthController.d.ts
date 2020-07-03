import { IRouteController } from '../IRouteController.js';
import { RouteExposedMethods } from '../IExposedMethods.js';
import { RoutedMethod } from '../RoutedMethod.js';
import { RouteMiddleware } from '../../middleware/RouteMiddleware.js';
export declare class AuthController implements IRouteController {
    readonly baseUrl: string;
    readonly isRestful: boolean;
    readonly middlewares: RouteMiddleware[];
    private loginAttemptManager;
    exposedMethods(): RouteExposedMethods;
    login: RoutedMethod;
    refresh: RoutedMethod;
    destroyRefreshToken: RoutedMethod;
    logout: RoutedMethod;
}
