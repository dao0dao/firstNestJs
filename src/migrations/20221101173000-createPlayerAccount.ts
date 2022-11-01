import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";
module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.createTable("player_account", {
      id: {
        primaryKey: true,
        type: DataType.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      wallet: {
        type: DataType.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.0,
      },
      playerId: {
        type: DataType.UUID,
        allowNull: false,
        references: {
          model: "players",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      playerName: {
        type: DataType.STRING,
        allowNull: false,
        references: {
          model: "players",
          key: "name",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      playerSurname: {
        type: DataType.STRING,
        allowNull: false,
        references: {
          model: "players",
          key: "surname",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.dropTable("player_account");
  },
};
