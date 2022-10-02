import { QueryInterface } from 'sequelize';
import bcrypt from 'bcrypt';
const saltRounds = 13;

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert('administrators', [
      {
        id: '04ca1979-f150-46b3-a217-956395ffe53c',
        name: 'admin',
        login: 'admin',
        password: await bcrypt.hash('admin', saltRounds),
        isAdmin: true,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete('administrators', {
      name: 'admin',
    });
  },
};
