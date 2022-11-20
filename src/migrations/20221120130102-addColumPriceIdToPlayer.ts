import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.addColumn("players", "price_list_id", {
      type: DataType.UUID,
      allowNull: true,
      references: {
        model: "price_list",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.removeColumn("players", "priceListId");
  },
};
