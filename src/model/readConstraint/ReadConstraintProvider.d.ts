import { QueryBuilder } from 'knex';
export declare type ReadConstraintProvider = (query: QueryBuilder, context: ReadContext) => QueryBuilder | Promise<QueryBuilder>;
export interface ReadContext {
}
