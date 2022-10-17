import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";

@Injectable()
export class AdministratorService {
  constructor(
    @InjectModel(Administrator) private administratorModel: typeof Administrator
  ) {}

  findAdministratorById(id: string): Promise<Administrator | null> {
    return this.administratorModel.findOne({
      where: { id },
    });
  }

  findAdministratorByLogin(login: string) {
    return this.administratorModel.findOne({ where: { login } });
  }
}
