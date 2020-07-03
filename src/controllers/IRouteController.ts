import { RouteExposedMethods } from './IExposedMethods.js';
import { RouteMiddleware } from '../middleware/RouteMiddleware.js';

export interface IRouteController {

  readonly baseUrl: string;
  readonly isRestful: boolean;
  /**
   * Middlewares
   * ------------
   * Controller level middlewares!
   * 
   * All exposed methods will use this middleware
   */
  readonly middlewares: RouteMiddleware[];

  exposedMethods: () => RouteExposedMethods;

}
