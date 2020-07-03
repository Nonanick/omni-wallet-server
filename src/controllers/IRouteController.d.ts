import { RouteExposedMethods } from './IExposedMethods.js';
export interface IRouteController {
    readonly baseUrl: string;
    readonly isRestful: boolean;
    exposedMethods: () => RouteExposedMethods;
}
