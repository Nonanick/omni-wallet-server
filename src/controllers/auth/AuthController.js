var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoginAttemptManager } from './loginAttempt/LoginAttemptManager.js';
import { LogAndFail } from '../../logger/LogAndFail.js';
import { UserCredentials } from '../../user/authentication/UserCredentials.js';
import Useragent from 'useragent';
export class AuthController {
    constructor() {
        this.baseUrl = 'auth';
        this.isRestful = false;
        this.middlewares = [];
        this.loginAttemptManager = new LoginAttemptManager();
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const username = req.body.username;
            const password = req.body.password;
            try {
                const loginAttempt = this.loginAttemptManager.requestLoginAttempt(req);
                const credentials = new UserCredentials(username, password);
                const hasValidCredentials = yield credentials.validate();
                if (hasValidCredentials) {
                    const { authToken, refreshToken } = yield credentials.generateTokens(Useragent.lookup((_a = req.headers['user-agent']) !== null && _a !== void 0 ? _a : 'UA_NOT_DEFINED'));
                    loginAttempt.success = true;
                    this.loginAttemptManager.clearLoginAttempts(req);
                    res.json({
                        success: true,
                        refresh: refreshToken,
                        auth: authToken
                    });
                }
                else {
                    LogAndFail({
                        res,
                        message: 'Não foi possível realizar o login!',
                        errorCode: 'SYS.LOGIN.FAILED_TO_VALIDATE_CREDENTIALS',
                        httpCode: 401
                    });
                    return;
                }
            }
            catch (err) {
                LogAndFail({
                    res,
                    message: 'Não foi possível realizar o login!' + err,
                    errorCode: 'SYS.LOGIN.FAILED_REQUEST_LOGIN_ATTEMPT',
                    httpCode: 401
                });
                return;
            }
        });
        this.refresh = (req, res, next) => {
        };
        this.destroyRefreshToken = (req, res, next) => {
        };
        this.logout = (req, res, next) => {
        };
    }
    exposedMethods() {
        return [
            {
                functionName: "login",
                url: "login",
                httpMethods: ["POST"],
            }
        ];
    }
}
