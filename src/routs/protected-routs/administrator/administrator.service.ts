import { Injectable } from "@nestjs/common";
import { AdministratorDTO } from "./administrator.dto";
import {
  AdministratorCreateErrors,
  AdministratorUpdateErrors,
  LoginAdministratorUpdateErrors,
} from "./administrator.interfaces";
import { AdministratorSQLService } from "./administrator-sql.service";

@Injectable()
export class AdministratorService {
  constructor(private adminSQL: AdministratorSQLService) {}

  async checkCanUpdateLoginAdministrator(
    admin_id: string,
    admin: AdministratorDTO
  ) {
    const allAdmins = await this.adminSQL.findAllUsersAndAdmin();
    const errors = {} as LoginAdministratorUpdateErrors;
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

  async checkCanAddAdministrator(data: AdministratorDTO) {
    const allAdmins = await this.adminSQL.findAllUsers();
    const errors = {} as AdministratorCreateErrors;
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
  async checkCanUpdateAdministrator(admin_id: string, data: AdministratorDTO) {
    const admins = await this.adminSQL.findAllUsers();
    const allAdmins = admins.filter((el) => el.id !== admin_id);
    const errors = {} as AdministratorUpdateErrors;
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
    const user = await this.adminSQL.findUserWithoutSuperAdminById(id);
    if (!user) {
      return false;
    }
    return user.destroy().then(() => true);
  }
}
