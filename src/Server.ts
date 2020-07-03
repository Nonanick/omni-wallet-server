import { EventEmitter } from 'events';
import { BootSequence, BootableOptions } from './boot/BootSequence.js';
import { Bootable } from './boot/Bootable.js';
import { ServerEvents } from './ServerEvents.js';
import { IRouteController } from './controllers/IRouteController.js';
import { WinstonLogger } from './logger/WinstonLogger.js';
import { UsuarioController } from './controllers/usuario/UsuarioController.js';
import { EmpresaController } from './controllers/empresa/EmpresaController.js';
import { AuthController } from './controllers/auth/AuthController.js';
import { UserRepository } from './user/repository/UserRepository.js';

export class Server extends EventEmitter {

  protected _boot: BootSequence;

  protected _userRepo: UserRepository;

  protected _controllers: {
    [url: string]: IRouteController
  } = {};

  constructor() {
    super();
    this._boot = new BootSequence();
    this._userRepo = new UserRepository(this);

    this.addController(
      new UsuarioController(),
      new EmpresaController(),
      new AuthController()
    );
  }

  public users(): UserRepository {
    return this._userRepo;
  }

  public addController(...controllers: IRouteController[]) {
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

  public addBootable(item: Bootable, options?: BootableOptions) {
    return this._boot.addBootable(item.getBootableItemName(), item, options);
  }

  public async boot() {
    return this._boot.initialize();
  }
}
