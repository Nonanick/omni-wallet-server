import { EventEmitter } from 'events';
import { Bootable } from './Bootable.js';
import { WinstonLogger } from '../logger/WinstonLogger.js';

export const BootableItemOfSequenceResolved = 'bootableResolved';
export const BootSequenceFinished = 'allResolved';

export type BootableOptions = {
  dependencies?: string[];
  triggerEvent?: string | string[];
};

export type BootItemOptions = {
  item: Bootable;
} & Required<BootableOptions>;

export class BootSequence extends EventEmitter {
  private static defaultBootableOptions: BootableOptions =
    {
      dependencies: [],
      triggerEvent: 'ready',
    };

  private __bootableResolvedFn: (name: string, resolved: boolean) => void =
    (name, resolved) => {
      this.__resolvedBootables[name] = resolved;

      const allBootables = Array.from(this.__bootableItens.keys());

      if (this.verifyBootDependencies(allBootables)) {
        this.emit(BootSequenceFinished, allBootables);
      }
    };

  protected _initialize!: Promise<any>;

  private __bootableItens: Map<string, BootItemOptions>;

  private __resolvedBootables: { [name: string]: boolean } = {};

  constructor() {
    super();
    this.__bootableItens = new Map();

    this.on(BootableItemOfSequenceResolved, this.__bootableResolvedFn);
  }

  public addBootable(name: string, item: Bootable, opcoes?: BootableOptions) {
    this.__bootableItens.set(
      name,
      {
        item,
        dependencies: [],
        triggerEvent: 'ready',
        ...BootSequence.defaultBootableOptions,
        ...opcoes,
      },
    );
  }

  private createBootPromise(): Promise<boolean> {
    const initializationPromise = new Promise<boolean>((resolve, reject) => {
      const initFn = async () => {
        const allBootables: string[] = Array.from(this.__bootableItens.keys());
        if (allBootables.length === 0) {
          resolve(true);
        }

        this.__bootableItens.forEach((bootableOptions, nome) => {
          // # - Check dependencies existence
          if (bootableOptions.dependencies.length > 0) {
            // # - Make sure that all dependencies exists
            bootableOptions.dependencies.forEach((dep) => {
              if (allBootables.indexOf(dep) < 0) {
                reject(
                  new Error(
                    `[Bootstrap] Erro na sequencia de boot! Dependencia '${dep}' não encontrada!
                    Lista de todos os itens passados: ${allBootables}`,
                  ),
                );
              }
            });
            this.bootAfterDependencies(nome, bootableOptions.item, bootableOptions.dependencies);
          } else {
            this.bootItem(nome, bootableOptions.item);
          }
        });

        this.once(BootSequenceFinished, () => {
          // Release Boot Itens
          delete this.__bootableItens;
          resolve(true);
        });
      };

      this.once('initialize', initFn);
    });

    this._initialize = initializationPromise;

    return initializationPromise;
  }

  protected bootItem(name: string, item: Bootable) {
    const dependencies = item.getBootDependencies();
    const injectDependencies: { [name: string]: any } = {};

    for (const dependency of dependencies) {
      if (this.__bootableItens.has(dependency)) {
        injectDependencies[dependency] = this.__bootableItens.get(dependency)!.item;
      }
    }

    const bootAnswer = item.getBootFunction(injectDependencies)();

    if (bootAnswer instanceof Promise) {
      bootAnswer
        .then((success) => {
          this.__resolvedBootables[name] = success;
          const trigger = this.__bootableItens.get(name)!.triggerEvent;
          if (Array.isArray(trigger)) {
            trigger.forEach((t) => item.emit(t));
          } else {
            item.emit(trigger);
          }
          this.emit(BootableItemOfSequenceResolved, name, success);
        })
        .catch((err) => {
          WinstonLogger.error(`[Bootstrap] Failed to boot ${name}!\nError: ${err}`);
        });
    } else {
      this.__resolvedBootables[name] = bootAnswer === true;
      this.emit(BootableItemOfSequenceResolved, name, bootAnswer === true);
    }
  }

  protected bootAfterDependencies(name: string, item: Bootable, dependencies: string[]) {
    let allDependenciesAreResolved = this.verifyBootDependencies(dependencies);

    if (allDependenciesAreResolved) {
      this.bootItem(name, item);
    } else {
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

  protected verifyBootDependencies(dependencies: string[]): boolean {
    let allResolved = true;

    dependencies.forEach((dep) => {
      if (this.__resolvedBootables[dep] === undefined) {
        allResolved = false;
      }
    });
    return allResolved;
  }

  public onInitialize(): Promise<boolean> {
    if (this._initialize == null) {
      this.createBootPromise();
    }

    return this._initialize;
  }

  async initialize(): Promise<boolean> {
    const initPromise = this.onInitialize();
    this.emit('initialize');
    return initPromise;
  }
}
