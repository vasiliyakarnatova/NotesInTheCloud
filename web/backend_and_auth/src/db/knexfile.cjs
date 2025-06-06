// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const {knexSnakeCaseMappers} = require('objection');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      host: 'localhost',
      port: 5432,
      database: 'web',
      user:     'postgres',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
    },
    ...knexSnakeCaseMappers(),
  },
};
