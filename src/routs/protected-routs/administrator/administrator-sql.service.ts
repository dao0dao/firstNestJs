import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { createPassword } from "src/utils/bcript";
import { AdministratorDTO } from "./administrator.dto";
import { Op } from "sequelize";

@Injectable()
export class AdministratorSQLService {
  constructor(
    @InjectModel(Administrator) private administratorModel: typeof Administrator
  ) {}

  findUserById(id: string) {
    return this.administratorModel.findOne({
      where: { id },
    });
  }

  findUserWithoutSuperAdminById(id: string) {
    return this.administratorModel.findOne({
      where: {
        id,
        superAdmin: {
          [Op.not]: true,
        },
      },
    });
  }

  findAdministratorByLogin(login: string) {
    return this.administratorModel.findOne({ where: { login } });
  }

  returnAdminNickAndNameByName(name: string) {
    return this.administratorModel.findOne({
      where: { name },
      attributes: ["name", "login"],
    });
  }

  findAllUsers() {
    return this.administratorModel.findAll({ where: { isAdmin: false } });
  }
  findAllUsersAndAdmin() {
    return this.administratorModel.findAll();
  }

  async updateAdministratorById(
    id: string,
    data: AdministratorDTO
  ): Promise<Administrator> {
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

  async createAdministrator(data: AdministratorDTO): Promise<Administrator> {
    const password = await createPassword(data.password);
    return this.administratorModel.create({
      name: data.name,
      login: data.login,
      password,
    });
  }
}
