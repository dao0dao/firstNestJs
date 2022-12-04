import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.createTable("timetable", {
      id: {
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
      },
      date: {
        allowNull: false,
        type: DataType.STRING,
      },
      layer: {
        allowNull: false,
        type: DataType.INTEGER,
      },
      time_from: {
        allowNull: false,
        type: DataType.STRING,
      },
      time_to: {
        allowNull: false,
        type: DataType.STRING,
      },
      court: {
        allowNull: false,
        type: DataType.INTEGER,
      },
      player_one: {
        allowNull: true,
        type: DataType.UUID,
      },
      player_two: {
        allowNull: true,
        type: DataType.UUID,
      },
      guest_one: {
        allowNull: true,
        type: DataType.STRING,
      },
      guest_two: {
        allowNull: true,
        type: DataType.STRING,
      },
      hour_count: {
        allowNull: false,
        type: DataType.DECIMAL(10, 2),
      },
      is_player_one_payed: {
        allowNull: true,
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
      is_player_two_payed: {
        allowNull: true,
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
      is_first_payment: {
        allowNull: true,
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize) {
    return queryInterface.dropTable("timetable");
  },
};
