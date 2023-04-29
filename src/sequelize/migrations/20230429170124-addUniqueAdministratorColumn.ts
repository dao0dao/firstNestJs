import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.addColumn("administrators", "superAdmin", {
      type: DataType.BOOLEAN,
      allowNull: true,
      unique: true,
    });
  },

  async down(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.removeColumn("administrators", "superAdmin");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
