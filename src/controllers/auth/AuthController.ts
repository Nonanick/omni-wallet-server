import { IRouteController } from '../IRouteController.js';
import { RouteExposedMethods } from '../IExposedMethods.js';
import { RoutedMethod } from '../RoutedMethod.js';
import { RouteMiddleware } from '../../middleware/RouteMiddleware.js';

export class AuthController implements IRouteController {
  public readonly baseUrl: string = 'auth';

  public readonly isRestful: boolean = false;

  public readonly middlewares: RouteMiddleware[] = [];

  public exposedMethods(): RouteExposedMethods {
    return [];
  }

  public login: RoutedMethod = (req, res, next) => {

  };

  public refresh: RoutedMethod = (req, res, next) => {

  };

  public destroyRefreshToken: RoutedMethod = (req, res, next) => {

  };

  public logout: RoutedMethod = (req, res, next) => {

  };

}
