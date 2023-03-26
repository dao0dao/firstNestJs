import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.createTable("services", {
      id: {
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("services");
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
