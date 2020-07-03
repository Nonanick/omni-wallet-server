import { TableCatalog } from '../CatalogoTabela.js';
export const up = (conexao) => (conexao.schema.createTable(TableCatalog.Usuario, (builder) => {
    builder.specificType('_id', 'CHAR(22)').primary().notNullable();
    builder.string('usuario', 100).unique();
    builder.string('email', 255).unique();
    builder.text('senha').notNullable();
    // As relações serão geradas APÓS a criação das tabelas!
    builder.specificType('empresa_id', 'CHAR(22)').index();
    builder.string('status').notNullable().defaultTo('ACTIVE');
}));
export const down = (connection) => (connection.schema.dropTable(TableCatalog.Usuario));
