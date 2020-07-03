import { Application } from 'express';
import { IExposedMethod } from '../../controllers/IExposedMethods.js';
import { IRouteController } from '../../controllers/IRouteController.js';

export type BindMethodToExpressParameters = {
  server: Application;
  controler: IRouteController;
  exposedMethod: IExposedMethod;
  httpMethod: 'GET' | 'PUT' | 'POST' | 'DELETE';
};