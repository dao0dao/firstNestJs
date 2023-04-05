import { ConfigModule } from "@nestjs/config";
import { ServeStaticModule } from "@nestjs/serve-static";
import { StaticModuleForRoot } from "./utils/staticFiles";
import { SequelizeModule } from "@nestjs/sequelize";
import { mysqlTables } from "./models/mysql-tables";

export const envConfig = ConfigModule.forRoot();
export const staticFolder = ServeStaticModule.forRoot(StaticModuleForRoot);
export const sequelizeIntegration = SequelizeModule.forRoot({
  dialect: "mysql",
  host: process.env.DATABASE_host,
  port: parseInt(process.env.DATABASE_port),
  username: process.env.DATABASE_username,
  password: process.env.DATABASE_password,
  database: process.env.DATABASE_database,
  models: mysqlTables,
  define: {
    timestamps: false,
  },
});
