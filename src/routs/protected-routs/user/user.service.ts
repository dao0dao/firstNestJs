import { Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import {
  UserCreateErrors,
  UserUpdateErrors,
  LoginUserUpdateErrors,
} from "./user.interfaces";
import { UserSQLService } from "../../../models/model/user/user-sql.service";

@Injectable()
export class UserService {
  constructor(private userSQL: UserSQLService) {}

  async checkCanUpdateLoginUser(admin_id: string, admin: UserDTO) {
    const allAdmins = await this.userSQL.findAllUsersAndAdmin();
    const errors = {} as LoginUserUpdateErrors;
    for (const el of allAdmins) {
      if (el.login === admin.login && el.id !== admin_id) {
        errors.reservedLogin = true;
      }
      if (el.name === admin.name && el.id !== admin_id) {
        errors.reservedName = true;
      }
      if (admin.newPassword !== admin.confirmNewPassword) {
        errors.passwordNotMatch = true;
      }
    }
    const existUser = allAdmins.find((el) => el.id === admin_id);
    if (!existUser) {
      errors.notExist = true;
    }
    return errors;
  }

  async checkCanAddUser(data: UserDTO) {
    const allAdmins = await this.userSQL.findAllUsers();
    const errors = {} as UserCreateErrors;
    if (data.confirmNewPassword !== data.newPassword) {
      errors.passwordDoesNotMatch = true;
    }
    for (const el of allAdmins) {
      if (el.name === data.name || el.login === data.login) {
        errors.canNotCreateUser = true;
      }
    }
    return errors;
  }
  async checkCanUpdateUser(admin_id: string, data: UserDTO) {
    const admins = await this.userSQL.findAllUsers();
    const allAdmins = admins.filter((el) => el.id !== admin_id);
    const errors = {} as UserUpdateErrors;
    if (!admin_id) {
      errors.id = true;
    }
    for (const el of allAdmins) {
      el.name == data.name ? (errors.name = true) : null;
      el.login == data.login ? (errors.reservedLogin = true) : null;
    }
    data.password == data.confirmPassword && data.password === ""
      ? (errors.confirmNewPassword = true)
      : null;
    return errors;
  }

  async deleteUser(id: string) {
    const user = await this.userSQL.findUserWithoutSuperAdminById(id);
    if (!user) {
      return false;
    }
    return user.destroy().then(() => true);
  }
}
