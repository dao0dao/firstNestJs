import { QueryInterface } from "sequelize";
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.createDatabase(process.env.DATABASE_database);
  },
};
