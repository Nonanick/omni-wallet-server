import jsonwebtoken from 'jsonwebtoken';
import Useragent from 'useragent';
import { RouteMiddleware } from '../RouteMiddleware.js';
import { LogAndFail } from '../../logger/LogAndFail.js';
import { AuthConfig } from '../../config/AuthConfig.js';
import { UserTokenPayload } from '../../user/authentication/UserTokenPayload.js';
import { DbConnection } from '../../database/DbConnection.js';
import { TableCatalog } from '../../database/CatalogoTabela.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';

export const AuthMiddleware: RouteMiddleware & { verifyLinkedRefreshToken: (user: string, id: string, device: string) => Promise<boolean> } = {

  middlewareFunction: async (req, res, next) => {

    // No auth header!
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
      const tokenPayload: UserTokenPayload = jsonwebtoken.verify(token, AuthConfig.jwtSecret) as any;
      const device = JSON.stringify(Useragent.lookup(req.headers['user-agent']));

      // Verify if refresh token that generated it is acitve!
      AuthMiddleware.verifyLinkedRefreshToken(tokenPayload.username, tokenPayload.token_id, device)
        .then((valid) => {
          if (valid) {
            (req as any)['user'] = AuthMiddleware.server?.users().byUsername(tokenPayload.username);
            WinstonLogger.info(`Auth Middleware verified user ${tokenPayload.username} to route!`);
            next();
          } else {
            LogAndFail({
              res,
              message: 'Failed to verify token!',
              errorCode: 'SYS.AUTHENTICATION.FAILED_TO_VERIFY_TOKEN',
              httpCode: 403
            });
          }
        })
    } catch (err) {
      LogAndFail({
        res,
        message: 'This route is protected! Only authorized users can access it!',
        errorCode: 'SYS.SECURITY.INVALID_AUTHORIZATION',
        httpCode: 403
      });
      return;
    }
  },

  /**
   * Check if the refresh token associated with an access token
   * is meant for the device requesting it AND its former refresh token
   * is still considered active
   */
  verifyLinkedRefreshToken: async (username: string, tokenId: string, device: string) => {
    return await DbConnection.select('*').from(TableCatalog.UsuarioRefreshToken)
      .where('usuario', username)
      .where('_id', tokenId)
      .where('dispositivo', device)
      .where('status', 'ACTIVE')
      .then((refreshs) => {
        return refreshs.length == 1;
      });
  }

};
