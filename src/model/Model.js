var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { WinstonLogger } from '../logger/WinstonLogger.js';
import { DbConnection } from '../database/DbConnection.js';
export class Model {
    constructor(fromTable, user) {
        this._changedColumns = [];
        this._modelInnerState = 'NOT_ON_DATABASE';
        this.values = {};
        this.primaryField = '_id';
        this.columns = {};
        this.readConstraints = [];
        this.tableName = fromTable;
    }
    get(property) {
        return __awaiter(this, void 0, void 0, function* () {
            let value;
            let strProperty = String(property);
            if (this.values[property] !== undefined) {
                value = this.values[property];
            }
            else if (this.columns[strProperty].defaultValue !== undefined) {
                const defValue = this.columns[strProperty].defaultValue;
                if (typeof defValue === "function") {
                    value = defValue();
                }
                else {
                    value = this.columns[strProperty].defaultValue;
                }
            }
            if (this.columns[strProperty].getProxies != null) {
                let proxies = this.columns[strProperty].getProxies;
                for (const proxy of proxies) {
                    let oldValue = value;
                    value = yield proxy(oldValue);
                    if (value == null)
                        value = oldValue;
                }
            }
        });
    }
    set(propOrObject, value) {
        if (typeof propOrObject === "string") {
            const key = propOrObject;
            return this.set(({
                [key]: value
            }));
        }
        for (const propName in propOrObject) {
            const objAsAny = propOrObject;
            if (this.columns[propName] != null) {
                // Ignore undefined values
                if (objAsAny[propName] === undefined) {
                    continue;
                }
                // Update changed columns
                this.updateChangedColumns(propName);
            }
            else {
                // should i allow setting values not on column list?
                WinstonLogger.warn(`Model property ${propName} was NOT found in column list!`);
                this.values = propOrObject[propName];
            }
        }
    }
    loadById(id, searchByColumn) {
        return __awaiter(this, void 0, void 0, function* () {
            let read = DbConnection
                .select('*')
                .from(this.tableName)
                .where(searchByColumn !== null && searchByColumn !== void 0 ? searchByColumn : this.primaryField, id);
            yield this.applyReadConstraints(read);
        });
    }
    applyReadConstraints(query) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const constraint of this.readConstraints) {
                yield constraint(query, {});
            }
        });
    }
    updateChangedColumns(columnName) {
        if (this._modelInnerState !== 'NOT_ON_DATABASE') {
            this._modelInnerState = 'CHANGED';
            if (!this._changedColumns.includes(columnName)) {
                this._changedColumns.push(columnName);
            }
        }
    }
}
