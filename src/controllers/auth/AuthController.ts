import { IRouteController } from '../IRouteController.js';
import { RouteExposedMethods } from '../IExposedMethods.js';

export class AuthController implements IRouteController {
  public readonly baseUrl: string = 'auth';

  public readonly isRestful: boolean = false;

  public exposedMethods(): RouteExposedMethods {
    return [];
  }
}
