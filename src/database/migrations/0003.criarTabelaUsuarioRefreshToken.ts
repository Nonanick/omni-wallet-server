import Knex from 'knex';
import { TableCatalog } from '../CatalogoTabela.js';

export const up = (conexao: Knex) => (
  conexao.schema.createTable(TableCatalog.UsuarioRefreshToken,
    (builder) => {
      builder.specificType('_id', 'CHAR(22)').primary().notNullable();
      builder.string('usuario', 100).notNullable();
      builder.text('token');
      builder.json('dispositivo').notNullable();
      builder.string('status').defaultTo('ACTIVE').index().notNullable();
      builder.timestamp('criado_em').defaultTo(conexao.raw('CURRENT_TIMESTAMP'));
    })
);

export const down = (connection: Knex) => (
  connection.schema.dropTable(TableCatalog.UsuarioRefreshToken)
);
