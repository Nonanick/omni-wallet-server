/// <reference types="node" />
import { EventEmitter } from 'events';
import { BootSequence, BootableOptions } from './boot/BootSequence.js';
import { Bootable } from './boot/Bootable.js';
import { IRouteController } from './controllers/IRouteController.js';
import { UserRepository } from './user/repository/UserRepository.js';
export declare class Server extends EventEmitter {
    protected _boot: BootSequence;
    protected _userRepo: UserRepository;
    protected _controllers: {
        [url: string]: IRouteController;
    };
    constructor();
    users(): UserRepository;
    addController(...controllers: IRouteController[]): void;
    addBootable(item: Bootable, options?: BootableOptions): void;
    boot(): Promise<boolean>;
}
