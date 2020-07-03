import { TableCatalog } from '../CatalogoTabela.js';
export const up = (conexao) => (conexao.schema.createTable(TableCatalog.Empresa, (builder) => {
    builder.specificType('_id', 'CHAR(22)').primary().notNullable();
    builder.string('empresa', 100).unique();
    builder.string('logo', 255);
    builder.string('cor_principal', 255);
    builder.timestamp('criado_em').defaultTo(conexao.raw('CURRENT_TIMESTAMP'));
}));
export const down = (connection) => (connection.schema.dropTable(TableCatalog.Usuario));
