const config = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'omniview',
    },
    migrations: {
      directory: './src/database/migrations',
      extension: 'js',
      tableName: 'omni_migrations',
      loadExtensions: ['.js'],
    },
    seeds: {
      directory: './src/database/dev_seeds',
      extension: 'js',
      loadExtensions: ['.js'],
    },
  },
};

export const {
  client,
  connection,
  migrations,
  seeds,
} = config.development;
