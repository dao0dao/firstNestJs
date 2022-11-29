import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.createTable("price_list", {
      id: {
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
      },
      name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      hours: {
        type: DataType.JSON,
        allowNull: false,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable("price_list");
  },
};
