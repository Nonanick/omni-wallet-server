/// <reference types="node" />
import { EventEmitter } from 'events';
export declare class Usuario extends EventEmitter {
    protected _username: string;
    protected _email: string;
    constructor(username: string);
}
