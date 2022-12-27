import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.addColumn("price_list", "default_Price", {
      type: DataType.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.removeColumn("price_list", "default_Price");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
