import { QueryInterface, Sequelize } from "sequelize";
import { DataType } from "sequelize-typescript";
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.createDatabase("korty");
  },
};
