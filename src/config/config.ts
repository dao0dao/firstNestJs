// sequelize database connection configuration
module.exports = {
  development: {
    username: process.env.DATABASE_username,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE_database,
    host: process.env.DATABASE_host,
    port: process.env.DATABASE_port,
    dialect: "mysql",
    migrationStorageTableName: "migrations",
  },
  production: {
    username: process.env.DATABASE_username,
    password: process.env.DATABASE_password,
    database: process.env.DATABASE_database,
    host: process.env.DATABASE_host,
    port: process.env.DATABASE_port,
    dialect: "mysql",
    migrationStorageTableName: "migrations",
  },
};
