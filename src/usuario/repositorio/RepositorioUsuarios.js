import { EventEmitter } from 'events';
export class RepositorioUsuarios extends EventEmitter {
    constructor() {
        super();
        this._usuariosLogados = new Map();
    }
}
