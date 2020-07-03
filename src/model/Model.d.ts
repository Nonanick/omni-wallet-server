import { ColumnMetadata } from './columnMetadata/ColumnMetadata.js';
import { ReadConstraintProvider } from './readConstraint/ReadConstraintProvider.js';
import { Usuario } from '../usuario/Usuario.js';
export declare class Model<T = any> {
    private _changedColumns;
    private _modelInnerState;
    private values;
    primaryField: string;
    tableName: string;
    columns: {
        [columnName: string]: ColumnMetadata;
    };
    readConstraints: ReadConstraintProvider[];
    constructor(fromTable: string, user?: Usuario);
    get(property: keyof T): Promise<void>;
    set(property: keyof T, value: any): void;
    set(propertyObjects: Partial<T>): void;
    loadById(id: any, searchByColumn?: string): Promise<void>;
    private applyReadConstraints;
    private updateChangedColumns;
}
