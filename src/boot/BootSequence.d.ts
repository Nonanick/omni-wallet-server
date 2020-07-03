/// <reference types="node" />
import { EventEmitter } from 'events';
import { Bootable } from './Bootable.js';
export declare const BootableItemOfSequenceResolved = "bootableResolved";
export declare const BootSequenceFinished = "allResolved";
export declare type BootableOptions = {
    dependencies?: string[];
    triggerEvent?: string | string[];
};
export declare type BootItemOptions = {
    item: Bootable;
} & Required<BootableOptions>;
export declare class BootSequence extends EventEmitter {
    private static defaultBootableOptions;
    private __bootableResolvedFn;
    protected _initialize: Promise<any>;
    private __bootableItens;
    private __resolvedBootables;
    constructor();
    addBootable(name: string, item: Bootable, opcoes?: BootableOptions): void;
    private createBootPromise;
    protected bootItem(name: string, item: Bootable): void;
    protected bootAfterDependencies(name: string, item: Bootable, dependencies: string[]): void;
    protected verifyBootDependencies(dependencies: string[]): boolean;
    onInitialize(): Promise<boolean>;
    initialize(): Promise<boolean>;
}
