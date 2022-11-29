import * as dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";
import { QueryInterface } from "sequelize";
import * as bcrypt from "bcrypt";

module.exports = {
  async up(queryInterface: QueryInterface) {
    return queryInterface.bulkInsert("administrators", [
      {
        id: uuidv4(),
        name: "admin",
        login: "admin",
        password: await bcrypt.hash("admin", parseInt(process.env.SALT_ROUNDS)),
        isAdmin: true,
      },
    ]);
  },

  async down(queryInterface: QueryInterface) {
    return queryInterface.bulkDelete("administrators", {
      name: "admin",
    });
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
