import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { createPassword } from "src/utils/bcript";
import { AdministratorDTO } from "./administrator.dto";

@Injectable()
export class AdministratorService {
  constructor(
    @InjectModel(Administrator) private administratorModel: typeof Administrator
  ) {}

  findAdministratorById(id: string) {
    return this.administratorModel.findOne({
      where: { id },
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

  findAllAdministrators() {
    return this.administratorModel.findAll();
  }

  async updateAdministrator(
    data: AdministratorDTO,
    admin: Administrator
  ): Promise<Administrator> {
    admin.set({
      name: data.name,
      login: data.login,
    });
    if (data.password) {
      const password = await createPassword(data.password);
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
