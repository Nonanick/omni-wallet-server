import { EventEmitter } from 'events';
import { Usuario } from '../Usuario.js';

export class RepositorioUsuarios extends EventEmitter {
  private _usuariosLogados: Map<string, Usuario>;

  constructor() {
    super();
    this._usuariosLogados = new Map();
  }
}
