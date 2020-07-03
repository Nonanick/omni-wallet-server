import { ColumnMetadata } from './columnMetadata/ColumnMetadata.js';
import { ReadConstraintProvider } from './readConstraint/ReadConstraintProvider.js';
import { User } from '../user/User.js';
export declare class Model<T = any> {
    private _changedColumns;
    private _modelInnerState;
    private _saveSolutions;
    private values;
    primaryField: string;
    tableName: string;
    columns: {
        [columnName: string]: ColumnMetadata;
    };
    readConstraints: ReadConstraintProvider[];
    constructor(fromTable: string, user?: User);
    get(property: keyof T): Promise<void>;
    set(property: keyof T, value: any): void;
    set(propertyObjects: Partial<T>): void;
    loadById(id: any, searchByColumn?: string): Promise<void>;
    private applyReadConstraints;
    private updateChangedColumns;
    save(): Promise<void>;
    forceSave(): Promise<void>;
}
