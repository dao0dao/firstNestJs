import { QueryInterface } from "sequelize";
import { DataType } from "sequelize-typescript";
module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface
      .createTable("player_account", {
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
          references: {
            model: "players",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
      })
      .catch((e) => {
        throw new Error("Migration error");
      });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.dropTable("player_account");
  },
};
