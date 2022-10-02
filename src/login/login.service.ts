import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { isSamePasswords } from "src/utils/bcript";
import { LoginInputDTO, LoginOutputDTO } from "./login.dto";

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(Administrator) private AdminModel: typeof Administrator
  ) {}
  async login(data: LoginInputDTO): Promise<false | LoginOutputDTO> {
    const admin = await this.AdminModel.findOne({
      where: { login: data.nick },
    });
    if (!admin) {
      return false;
    }
    const isCorrectPassword = await isSamePasswords(
      data.password,
      admin.password
    );
    if (!isCorrectPassword) {
      return false;
    }
    const login: LoginOutputDTO = {
      isAdmin: admin.isAdmin,
      isLogin: true,
      user: admin.name,
    };
    return login;
  }
}
