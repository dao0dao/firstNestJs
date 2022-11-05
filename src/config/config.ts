// sequelize database connection configuration
module.exports = {
  development: {
    username: "root",
    password: "admin",
    database: "korty",
    host: "127.0.0.1",
    port: 3306,
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
