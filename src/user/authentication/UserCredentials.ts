import { IAuthentication } from './IAuthentication.js';
import { DbConnection } from '../../database/DbConnection.js';
import { IUsuario } from '../../database/interfaces/IUsuario.js';
import { TableCatalog } from '../../database/CatalogoTabela.js';
import { Agent } from 'useragent';
import { RefreshTokenPayload } from './RefreshTokenPayload.js';
import { nanoid } from 'nanoid';
import { AuthConfig } from '../../config/AuthConfig.js';
import { WinstonLogger } from '../../logger/WinstonLogger.js';
import { UserTokenPayload } from './UserTokenPayload.js';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UserCredentials implements IAuthentication {

  private _username: string;
  private _password: string;

  constructor(username: string, password: string) {
    this._password = password;
    this._username = username;
  }

  public async validate(): Promise<boolean> {

    return DbConnection.select<IUsuario[]>('*')
      .from(TableCatalog.Usuario)
      .where('usuario', this._username)
      .then((usuarios) => {
        if (usuarios.length != 1)
          return false;
        const passwordMatch = bcrypt.compareSync(this._password, usuarios[0].senha);
        return passwordMatch;
      });
  }

  public async generateTokens(device: Agent) {
    return this
      .searchForRefreshTokenPayload(JSON.stringify(device))
      .then((foundRefToken) => {
        if (foundRefToken == null) {
          return this.createRefreshTokenForDevice(device);
        }
        return jsonwebtoken.verify(foundRefToken, AuthConfig.jwtSecret, { ignoreExpiration: true }) as RefreshTokenPayload;
      })
      .then(async (refreshToken) => {
        return {
          refreshToken: jsonwebtoken.sign(refreshToken, AuthConfig.jwtSecret),
          authToken: await this.createAuthToken(refreshToken),
        };
      });
  }

  private async createRefreshTokenForDevice(device: Agent): Promise<RefreshTokenPayload> {
    const deviceStr = JSON.stringify(device);

    const payload: RefreshTokenPayload = {
      id: nanoid(22),
      username: this._username,
      device: deviceStr,
      refresh_id: nanoid(22)
    };

    const refreshToken = jsonwebtoken.sign(payload, AuthConfig.jwtSecret);
    try {
      await DbConnection
        .insert({
          _id: payload.id,
          usuario: this._username,
          token: refreshToken,
          dispositivo: deviceStr,
        })
        .into(TableCatalog.UsuarioRefreshToken);
    } catch (err) {
      WinstonLogger.error(`Failed to record refresh token in Database! ${err}`);
      throw err;
    }

    return payload;
  }

  private async createAuthToken(refreshToken: RefreshTokenPayload) {

    let authTokenPayload: UserTokenPayload = {
      username: this._username,
      token_id: refreshToken.id,
    };

    return jsonwebtoken.sign(authTokenPayload, AuthConfig.jwtSecret, {
      expiresIn: AuthConfig.tokenExpiration
    });

  }

  private async searchForRefreshTokenPayload(device: string) {
    return DbConnection
      .select('token')
      .from(TableCatalog.UsuarioRefreshToken)
      .where('usuario', this._username)
      .where('dispositivo', device)
      .where('status', 'ACTIVE')
      .then((res) => {
        if (res.length == 1)
          return res[0].token;
        else
          return;
      });
  }
}
