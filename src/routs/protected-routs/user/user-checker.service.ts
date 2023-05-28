import { Injectable } from "@nestjs/common";
import { UserSQLService } from "src/models/model/user/user-sql.service";
import { UserDTO } from "./user.dto";

@Injectable()
export class UserCheckerService {
  constructor(private userSQL: UserSQLService) {}

  async checkCanUpdateLoginUser(admin_id: string, admin: UserDTO) {
    const allAdmins = await this.userSQL.findAllUsersAndAdmin();
    for (const el of allAdmins) {
      if (el.login === admin.login && el.id !== admin_id) {
        return "reservedLogin";
      }
      if (el.name === admin.name && el.id !== admin_id) {
        return "reservedName";
      }
      if (admin.newPassword !== admin.confirmNewPassword) {
        return "passwordNotMatch";
      }
    }
    const existUser = allAdmins.find((el) => el.id === admin_id);
    if (!existUser) {
      return "notExist";
    }
    return "canUpdate";
  }

  async checkCanAddUser(data: UserDTO) {
    const allAdmins = await this.userSQL.findAllUsers();
    if (data.confirmNewPassword !== data.newPassword) {
      return "passwordDoesNotMatch";
    }
    for (const el of allAdmins) {
      if (el.name === data.name || el.login === data.login) {
        return "canNotCreateUser";
      }
    }
    return "canCreate";
  }
  async checkCanUpdateUser(admin_id: string, data: UserDTO) {
    const admins = await this.userSQL.findAllUsersAndAdmin();
    const allAdmins = admins.filter((el) => el.id !== admin_id);
    if (!admin_id) {
      return "wrongId";
    }
    for (const el of allAdmins) {
      if (el.name === data.name) {
        return "reservedName";
      }
      if (el.login === data.login) {
        return "reservedLogin";
      }
    }
    if (data.password === data.confirmPassword && data.password === "") {
      return "wrongPassword";
    }
    return "canUpdate";
  }
}
