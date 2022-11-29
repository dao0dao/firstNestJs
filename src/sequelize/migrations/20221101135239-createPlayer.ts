import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface
      .createTable("players", {
        id: {
          primaryKey: true,
          type: DataType.UUID,
          defaultValue: DataType.UUIDV4,
        },
        name: {
          allowNull: false,
          type: DataType.STRING(255),
        },
        surname: {
          allowNull: false,
          type: DataType.STRING(255),
        },
        telephone: {
          allowNull: false,
          type: DataType.STRING(255),
        },
        email: {
          allowNull: true,
          type: DataType.STRING,
        },
        court: {
          type: DataType.INTEGER,
          defaultValue: 0,
        },
        stringsName: {
          allowNull: true,
          type: DataType.STRING,
        },
        tension: {
          allowNull: true,
          type: DataType.STRING,
        },
        balls: {
          allowNull: true,
          type: DataType.STRING,
        },
        weeks: {
          allowNull: true,
          type: DataType.JSON,
        },
        notes: {
          allowNull: true,
          type: DataType.STRING,
        },
      })
      .then(() => {
        return queryInterface.createTable("opponents", {
          id: {
            primaryKey: true,
            type: DataType.INTEGER,
            autoIncrement: true,
          },
          opponentId: {
            allowNull: false,
            type: DataType.UUID,
          },
          playerId: {
            type: DataType.UUID,
            references: {
              model: "players",
              key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "CASCADE",
          },
        });
      });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface
      .dropTable("opponents")
      .then(() => queryInterface.dropTable("players"));
  },
};
