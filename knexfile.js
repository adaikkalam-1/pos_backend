
require("dotenv").config();

module.exports = {
    development: {
        client: process.env.DB_CLIENT || 'mysql',
        connection: {
          host: process.env.DB_HOST,
          user: process.env.DB_USER,
          port: process.env.DB_PORT,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        },
        migrations: {
          tableName: "knex_migrations",
          directory: process.env.MIGRATION_DIR || "./database/migrations",
        },
        seeds: {
          directory: process.env.SEEDS_DIR || "./database/seeds",
        }
    }
}