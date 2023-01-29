import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.createTable("player_history", {
      id: {
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
      },
      timetable_id: {
        type: DataType.INTEGER,
        allowNull: true,
        references: {
          model: "timetable",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      player_id: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      player_position: {
        type: DataType.DECIMAL(1, 0),
        allowNull: true,
      },
      service_date: {
        type: DataType.DATEONLY,
        allowNull: false,
      },
      service_name: {
        type: DataType.STRING(255),
        allowNull: false,
      },
      price: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
      },
      is_paid: {
        type: DataType.BOOLEAN,
        allowNull: false,
      },
      payment_method: {
        type: DataType.STRING(255),
        allowNull: true,
      },
      payment_date: {
        type: DataType.DATEONLY,
        allowNull: true,
      },
      cashier: {
        type: DataType.STRING(255),
        allowNull: true,
      },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface: QueryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
