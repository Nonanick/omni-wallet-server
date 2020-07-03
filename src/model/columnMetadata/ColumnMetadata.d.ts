import { ModelGetProxy } from './ModelGetProxy.js';
import { ModelSetProxy } from './ModelSetProxy.js';
import { ModelPropertyValidation } from './ModelPropertyValidation.js';
export interface ColumnMetadata {
    defaultValue: string | (() => any);
    required?: boolean;
    getProxies?: ModelGetProxy[];
    setProxies?: ModelSetProxy[];
    validations?: ModelPropertyValidation[];
}
