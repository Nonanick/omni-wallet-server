import { QueryBuilder } from 'knex';

export type ReadConstraintProvider = (query: QueryBuilder, context: ReadContext) => QueryBuilder | Promise<QueryBuilder>;

export interface ReadContext {

}