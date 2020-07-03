import { EventEmitter } from 'events';

export class User extends EventEmitter {
  protected _username: string;

  protected _email!: string;

  constructor(username: string) {
    super();
    this._username = username;
  }
}
