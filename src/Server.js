var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EventEmitter } from 'events';
import { BootSequence } from './boot/BootSequence.js';
import { ServerEvents } from './ServerEvents.js';
import { WinstonLogger } from './logger/WinstonLogger.js';
import { UsuarioController } from './controllers/usuario/UsuarioController.js';
import { EmpresaController } from './controllers/empresa/EmpresaController.js';
import { AuthController } from './controllers/auth/AuthController.js';
export class Server extends EventEmitter {
    constructor() {
        super();
        this._controllers = {};
        this._boot = new BootSequence();
        this.addController(new UsuarioController(), new EmpresaController(), new AuthController());
    }
    addController(...controllers) {
        for (const controller of controllers) {
            if (this._controllers[controller.baseUrl] != null) {
                WinstonLogger.warn(`Added controller with duplicated base URL!`);
            }
            this._controllers[controller.baseUrl] = controller;
            this._boot.onInitialize().then(_ => {
                this.emit(ServerEvents.CONTROLLER_ADDED, controller);
            });
        }
    }
    addBootable(item, options) {
        return this._boot.addBootable(item.getBootableItemName(), item, options);
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._boot.initialize();
        });
    }
}
