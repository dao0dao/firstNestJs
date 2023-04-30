import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { User } from "src/models/model/user/user.model";
import { createPassword } from "src/utils/bcript";
import { AdministratorDTO } from "../../../routs/protected-routs/user/administrator.dto";
import { Op } from "sequelize";

@Injectable()
export class UserSQLService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  findUserById(id: string) {
    return this.userModel.findOne({
      where: { id },
    });
  }

  findUserWithoutSuperAdminById(id: string) {
    return this.userModel.findOne({
      where: {
        id,
        superAdmin: {
          [Op.not]: true,
        },
      },
    });
  }

  findUserByLoginName(loginName: string) {
    return this.userModel.findOne({ where: { login: loginName } });
  }

  returnUserNameByLoginName(name: string) {
    return this.userModel.findOne({
      where: { name },
      attributes: ["name", "login"],
    });
  }

  findAllUsers() {
    return this.userModel.findAll({ where: { isAdmin: false } });
  }
  findAllUsersAndAdmin() {
    return this.userModel.findAll();
  }

  async updateUserById(id: string, data: AdministratorDTO): Promise<User> {
    const admin = await this.findUserById(id);
    admin.set({
      name: data.name,
      login: data.login,
    });
    if (data.newPassword) {
      const password = await createPassword(data.newPassword);
      admin.set({
        password,
      });
    }
    return admin.save();
  }

  async createUser(data: AdministratorDTO): Promise<User> {
    const password = await createPassword(data.password);
    return this.userModel.create({
      name: data.name,
      login: data.login,
      password,
    });
  }
}
