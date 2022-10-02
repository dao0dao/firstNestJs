import { QueryInterface } from 'sequelize';
import { DataType } from 'sequelize-typescript';

module.exports = {
  async up(queryInterface: QueryInterface) {
    queryInterface.createTable('administrators', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
      },
      name: {
        allowNull: false,
        type: DataType.STRING,
      },
      login: {
        allowNull: false,
        type: DataType.STRING,
      },
      password: {
        allowNull: false,
        type: DataType.STRING,
      },
      isAdmin: {
        allowNull: true,
        defaultValue: false,
        type: DataType.BOOLEAN,
      },
    });
  },

  async down(queryInterface: QueryInterface) {
    queryInterface.dropTable('administrators');
  },
};
