import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.addColumn("sessions", "administrator_id", {
      type: DataType.STRING(255),
      allowNull: false,
    });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.removeColumn("sessions", "administrator_id");
  },
};
