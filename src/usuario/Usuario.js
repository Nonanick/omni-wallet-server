import { EventEmitter } from 'events';
export class Usuario extends EventEmitter {
    constructor(username) {
        super();
        this._username = username;
    }
}
