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
import { WinstonLogger } from '../logger/WinstonLogger.js';
export const BootableItemOfSequenceResolved = 'bootableResolved';
export const BootSequenceFinished = 'allResolved';
let BootSequence = /** @class */ (() => {
    class BootSequence extends EventEmitter {
        constructor() {
            super();
            this.__bootableResolvedFn = (name, resolved) => {
                this.__resolvedBootables[name] = resolved;
                const allBootables = Array.from(this.__bootableItens.keys());
                if (this.verifyBootDependencies(allBootables)) {
                    this.emit(BootSequenceFinished, allBootables);
                }
            };
            this.__resolvedBootables = {};
            this.__bootableItens = new Map();
            this.on(BootableItemOfSequenceResolved, this.__bootableResolvedFn);
        }
        addBootable(name, item, opcoes) {
            this.__bootableItens.set(name, Object.assign(Object.assign({ item, dependencies: [], triggerEvent: 'ready' }, BootSequence.defaultBootableOptions), opcoes));
        }
        createBootPromise() {
            const initializationPromise = new Promise((resolve, reject) => {
                const initFn = () => __awaiter(this, void 0, void 0, function* () {
                    const allBootables = Array.from(this.__bootableItens.keys());
                    if (allBootables.length === 0) {
                        resolve(true);
                    }
                    this.__bootableItens.forEach((bootableOptions, nome) => {
                        // # - Check dependencies existence
                        if (bootableOptions.dependencies.length > 0) {
                            // # - Make sure that all dependencies exists
                            bootableOptions.dependencies.forEach((dep) => {
                                if (allBootables.indexOf(dep) < 0) {
                                    reject(new Error(`[Bootstrap] Erro na sequencia de boot! Dependencia '${dep}' não encontrada!
                    Lista de todos os itens passados: ${allBootables}`));
                                }
                            });
                            this.bootAfterDependencies(nome, bootableOptions.item, bootableOptions.dependencies);
                        }
                        else {
                            this.bootItem(nome, bootableOptions.item);
                        }
                    });
                    this.once(BootSequenceFinished, () => {
                        // Release Boot Itens
                        delete this.__bootableItens;
                        resolve(true);
                    });
                });
                this.once('initialize', initFn);
            });
            this._initialize = initializationPromise;
            return initializationPromise;
        }
        bootItem(name, item) {
            const dependencies = item.getBootDependencies();
            const injectDependencies = {};
            for (const dependency of dependencies) {
                if (this.__bootableItens.has(dependency)) {
                    injectDependencies[dependency] = this.__bootableItens.get(dependency).item;
                }
            }
            const bootAnswer = item.getBootFunction(injectDependencies)();
            if (bootAnswer instanceof Promise) {
                bootAnswer
                    .then((success) => {
                    this.__resolvedBootables[name] = success;
                    const trigger = this.__bootableItens.get(name).triggerEvent;
                    if (Array.isArray(trigger)) {
                        trigger.forEach((t) => item.emit(t));
                    }
                    else {
                        item.emit(trigger);
                    }
                    this.emit(BootableItemOfSequenceResolved, name, success);
                })
                    .catch((err) => {
                    WinstonLogger.error(`[Bootstrap] Failed to boot ${name}!\nError: ${err}`);
                });
            }
            else {
                this.__resolvedBootables[name] = bootAnswer === true;
                this.emit(BootableItemOfSequenceResolved, name, bootAnswer === true);
            }
        }
        bootAfterDependencies(name, item, dependencies) {
            let allDependenciesAreResolved = this.verifyBootDependencies(dependencies);
            if (allDependenciesAreResolved) {
                this.bootItem(name, item);
            }
            else {
                const resolveFn = () => {
                    allDependenciesAreResolved = this.verifyBootDependencies(dependencies);
                    if (allDependenciesAreResolved) {
                        this.off(BootableItemOfSequenceResolved, resolveFn);
                        this.bootItem(name, item);
                    }
                };
                this.on(BootableItemOfSequenceResolved, resolveFn);
            }
        }
        verifyBootDependencies(dependencies) {
            let allResolved = true;
            dependencies.forEach((dep) => {
                if (this.__resolvedBootables[dep] === undefined) {
                    allResolved = false;
                }
            });
            return allResolved;
        }
        onInitialize() {
            if (this._initialize == null) {
                this.createBootPromise();
            }
            return this._initialize;
        }
        initialize() {
            return __awaiter(this, void 0, void 0, function* () {
                const initPromise = this.onInitialize();
                this.emit('initialize');
                return initPromise;
            });
        }
    }
    BootSequence.defaultBootableOptions = {
        dependencies: [],
        triggerEvent: 'ready',
    };
    return BootSequence;
})();
export { BootSequence };
