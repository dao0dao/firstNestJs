import { Injectable } from "@nestjs/common";
import { AdministratorService } from "src/routs/administrator/administrator.service";
import { isSamePasswords } from "src/utils/bcript";
import { LoginInputDTO, LoginResponse } from "./login.dto";

@Injectable()
export class LoginService {
  constructor(private adminService: AdministratorService) {}
  async login(data: LoginInputDTO): Promise<false | LoginResponse> {
    const admin = await this.adminService.findAdministratorByLogin(data.nick);
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
    const login: LoginResponse = {
      isAdmin: admin.isAdmin,
      isLogin: true,
      user: admin.name,
      user_id: admin.id,
    };
    return login;
  }

  async checkIsLogin(administrator_id: string): Promise<LoginResponse | false> {
    const admin = await this.adminService.findAdministratorById(
      administrator_id
    );
    if (!admin) {
      return false;
    }
    const login: LoginResponse = {
      isAdmin: admin.isAdmin,
      isLogin: true,
      user: admin.name,
    };
    return login;
  }
}
