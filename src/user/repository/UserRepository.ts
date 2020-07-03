import { EventEmitter } from 'events';
import { Server } from '../../Server.js';
import { User } from '../User.js';

export class UserRepository extends EventEmitter {

  private _loggedUsers: Map<string, User>;

  private _server: Server;

  constructor(server: Server) {
    super();
    this._server = server;
    this._loggedUsers = new Map();
  }

  public byUsername(username: string) {

  }

}
