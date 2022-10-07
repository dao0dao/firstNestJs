import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.createTable("sessions", {
      id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: DataType.INTEGER,
      },
      session_id: {
        allowNull: false,
        type: DataType.STRING(255),
      },
      expired_at: {
        allowNull: false,
        type: DataType.DATE,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.dropTable("session");
  },
};
