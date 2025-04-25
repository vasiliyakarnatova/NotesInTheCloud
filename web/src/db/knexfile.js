// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */

const {knexSnakeCaseMappers} = require('objection');

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
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

const knex = require('knex');

const knexInstance = knex({
  client: 'postgresql',
  connection: {
    database: 'my_db',
    user:     'postgres',
    password: 'password'
  }
})

module.exports - knexInstance;
