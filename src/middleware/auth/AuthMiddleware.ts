import { RouteMiddleware } from '../RouteMiddleware.js';
import { LogAndFail } from '../../logger/LogAndFail.js';
import * as jwt from 'jsonwebtoken';
import { AuthConfig } from '../../config/AuthConfig.js';
import { UserTokenPayload } from '../../user/authentication/UserTokenPayload.js';

export const AuthMiddleware: RouteMiddleware = {

  middlewareFunction: (req, res, next) => {
    if (req.headers['authorization'] == null) {
      LogAndFail({
        res,
        message: 'This route is protected! Only authorized users can access it!',
        errorCode: 'SYS.SECURITY.UNAUTHORIZED_ACCESS',
        httpCode: 403
      });
      return;
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace(/^Bearer /, '');
    try {

      const tokenPayload: UserTokenPayload = jwt.verify(token, AuthConfig.jwtSecret) as any;

    } catch (err) {
      LogAndFail({
        res,
        message: 'This route is protected! Only authorized users can access it!',
        errorCode: 'SYS.SECURITY.INVALID_AUTHORIZATION',
        httpCode: 403
      });
      return;
    }

  }
};
