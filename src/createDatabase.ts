import mysql = require("mysql2");
import * as dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DATABASE_host,
  port: parseInt(process.env.DATABASE_port),
  user: process.env.DATABASE_username,
  password: process.env.DATABASE_password,
});
pool.query(
  "CREATE SCHEMA IF NOT EXISTS " + process.env.DATABASE_database,
  (err, res) => {
    if (res) {
      pool.end();
      process.exit();
    }
  }
);
