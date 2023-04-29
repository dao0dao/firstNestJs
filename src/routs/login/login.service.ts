import { Injectable } from "@nestjs/common";
import { AdministratorService } from "src/routs/protected-routs/administrator/administrator.service";
import { isSamePasswords } from "src/utils/bcript";
import { LoginInputDTO, User } from "./login.dto";

@Injectable()
export class LoginService {
  constructor(private adminService: AdministratorService) {}
  async loginUser(data: LoginInputDTO): Promise<false | User> {
    const registeredUser = await this.adminService.findAdministratorByLogin(
      data.nick
    );
    if (!registeredUser) {
      return false;
    }
    const isCorrectPassword = await isSamePasswords(
      data.password,
      registeredUser.password
    );
    if (!isCorrectPassword) {
      return false;
    }
    const user: User = {
      isAdmin: registeredUser.isAdmin,
      isLogin: true,
      user: registeredUser.name,
      user_id: registeredUser.id,
    };
    return user;
  }

  async checkIsLogin(administrator_id: string): Promise<User | false> {
    const admin = await this.adminService.findAdministratorById(
      administrator_id
    );
    if (!admin) {
      return false;
    }
    const login: User = {
      isAdmin: admin.isAdmin,
      isLogin: true,
      user: admin.name,
    };
    return login;
  }
}
