import Knex from 'knex';

export const DbConnection = Knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'omniview',
  },
});
