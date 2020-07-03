import { QueryBuilder } from 'knex';
import { ColumnMetadata } from './columnMetadata/ColumnMetadata.js';
import { WinstonLogger } from '../logger/WinstonLogger.js';
import { DbConnection } from '../database/DbConnection.js';
import { ReadConstraintProvider } from './readConstraint/ReadConstraintProvider.js';
import { SaveSolution } from './save/SaveSolution.js';
import { User } from '../user/User.js';

export class Model<T = any> {

  private _changedColumns: (keyof T)[] = [];

  private _modelInnerState: 'NOT_ON_DATABASE' | 'CHANGED' | 'SYNCHRONIZED' = 'NOT_ON_DATABASE';

  private _saveSolutions: {
    [state: string]: SaveSolution
  } = {};

  private values: any = {};

  public primaryField: string = '_id';

  public tableName: string;

  public columns: {
    [columnName: string]: ColumnMetadata
  } = {};

  public readConstraints: ReadConstraintProvider[] = [];

  constructor(fromTable: string, user?: User) {
    this.tableName = fromTable;
  }

  public async get(property: keyof T) {
    let value: any;
    let strProperty = String(property);

    if (this.values[property] !== undefined) {
      value = this.values[property];
    } else if (this.columns[strProperty].defaultValue !== undefined) {
      const defValue = this.columns[strProperty].defaultValue;
      if (typeof defValue === "function") {
        value = defValue();
      } else {
        value = this.columns[strProperty].defaultValue;
      }
    }

    if (this.columns[strProperty].getProxies != null) {
      let proxies = this.columns[strProperty].getProxies;
      for (const proxy of proxies!) {
        let oldValue = value;
        value = await proxy(oldValue);
        if (value == null)
          value = oldValue;
      }
    }
  }

  public set(property: keyof T, value: any): void;
  public set(propertyObjects: Partial<T>): void;
  public set(propOrObject: keyof T | Partial<T>, value?: any): void {

    // Redirect to always use {}
    if (typeof propOrObject === "string") {
      const key = propOrObject as keyof T;
      return this.set(
        ({
          [key]: value
        }) as Partial<T>
      );
    }

    for (const propName in propOrObject as any) {
      const objAsAny: any = propOrObject as any;

      if (this.columns[propName] != null) {

        // Ignore undefined values
        if (objAsAny[propName] === undefined) {
          continue;
        }

        // Update changed columns
        this.updateChangedColumns(propName as keyof T);

      } else {
        // should i allow setting values not on column list?
        WinstonLogger.warn(`Model property ${propName} was NOT found in column list!`);
        this.values = (propOrObject as any)[propName];
      }
    }


  }

  public async loadById(id: any, searchByColumn?: string) {

    let read = DbConnection
      .select<T[]>('*')
      .from(this.tableName)
      .where(searchByColumn ?? this.primaryField, id);

    await this.applyReadConstraints(read);

    read.then((search) => {
      if (search.length == 1) {
        this.set(search[0]);
        this._modelInnerState = 'SYNCHRONIZED';
      } else {
        throw new Error(`Falha ao localizar registro com o identificador ${id}, valor procurado na coluna ${searchByColumn ?? this.primaryField}`);
      }
    })
      .catch((err) => {
        throw new Error(`Falha ao requisitar registro para o banco! ${err}`);
      });

  }

  private async applyReadConstraints(query: QueryBuilder) {
    for (const constraint of this.readConstraints) {
      await constraint(query, {});
    }
  }

  private updateChangedColumns(columnName: keyof T) {
    if (this._modelInnerState !== 'NOT_ON_DATABASE') {
      this._modelInnerState = 'CHANGED';
      if (!this._changedColumns.includes(columnName)) {
        this._changedColumns.push(columnName);
      }
    }
  }

  public async save() {
    // Synchronized == do nothing
    if (this._modelInnerState === 'SYNCHRONIZED')
      return;

    if (this._saveSolutions[this._modelInnerState] != null) {

    }
  }

  public async forceSave() {

  }
}