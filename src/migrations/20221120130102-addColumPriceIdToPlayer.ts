import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.addColumn("players", "price_list_id", {
      type: DataType.UUID,
      allowNull: true,
      defaultValue: "",
      // unique: false,
      // references: {
      //   model: "price_list",
      //   key: "id",
      // },
      // onDelete: "CASCADE",
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn("players", "price_list_id");
  },
};
