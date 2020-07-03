import { IRouteController } from '../IRouteController.js';
import { RouteExposedMethods } from '../IExposedMethods.js';
import { RoutedMethod } from '../RoutedMethod.js';
import { RouteMiddleware } from '../../middleware/RouteMiddleware.js';
import { LoginAttemptManager } from './loginAttempt/LoginAttemptManager.js';
import { LogAndFail } from '../../logger/LogAndFail.js';
import { UserCredentials } from '../../user/authentication/UserCredentials.js';
import Useragent from 'useragent';

export class AuthController implements IRouteController {
  public readonly baseUrl: string = 'auth';

  public readonly isRestful: boolean = false;

  public readonly middlewares: RouteMiddleware[] = [];

  private loginAttemptManager = new LoginAttemptManager();

  public exposedMethods(): RouteExposedMethods {
    return [
      {
        functionName: "login",
        url: "login",
        httpMethods: ["POST"],
      }
    ];
  }

  public login: RoutedMethod = async (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    try {
      const loginAttempt = this.loginAttemptManager.requestLoginAttempt(req);
      const credentials = new UserCredentials(username, password);
      const hasValidCredentials = await credentials.validate();

      if (hasValidCredentials) {

        const { authToken, refreshToken } = await credentials.generateTokens(Useragent.lookup(req.headers['user-agent'] ?? 'UA_NOT_DEFINED'));

        loginAttempt.success = true;
        this.loginAttemptManager.clearLoginAttempts(req);

        res.json({
          success: true,
          refresh: refreshToken,
          auth: authToken
        });

      } else {
        LogAndFail({
          res,
          message: 'Não foi possível realizar o login!',
          errorCode: 'SYS.LOGIN.FAILED_TO_VALIDATE_CREDENTIALS',
          httpCode: 401
        });
        return;
      }
    } catch (err) {
      LogAndFail({
        res,
        message: 'Não foi possível realizar o login!' + err,
        errorCode: 'SYS.LOGIN.FAILED_REQUEST_LOGIN_ATTEMPT',
        httpCode: 401
      });
      return;
    }

  };

  public refresh: RoutedMethod = (req, res, next) => {

  };

  public destroyRefreshToken: RoutedMethod = (req, res, next) => {

  };

  public logout: RoutedMethod = (req, res, next) => {

  };

}
