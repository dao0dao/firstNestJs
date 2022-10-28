import { Injectable } from "@nestjs/common";
import { Administrator } from "src/models/model/administrator.model";
import { AdministratorDTO } from "./administrator.dto";
import {
  AdministratorCreateErrors,
  AdministratorUpdateErrors,
  LoginAdministratorUpdateErrors,
} from "./administrator.interfaces";

@Injectable()
export class AdministratorDataHandlerService {
  checkCanUpdateLoginAdministrator(
    admin_id: string,
    admin: AdministratorDTO,
    allAdmins: Administrator[]
  ) {
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
    return errors;
  }

  checkCanAddAdministrator(data: AdministratorDTO, allAdmins: Administrator[]) {
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
  checkCanUpdateAdministrator(
    admin_id: string,
    data: AdministratorDTO,
    admins: Administrator[]
  ) {
    const allAdmins = admins.filter((el) => el.id !== admin_id);
    const errors = {} as AdministratorUpdateErrors;
    if (!admin_id) {
      errors.id = true;
    }
    for (const el of allAdmins) {
      el.name == data.name ? (errors.name = true) : null;
      el.login == data.login ? (errors.reservedLogin = true) : null;
    }
    data.password == data.confirmPassword && data.password !== ""
      ? (errors.confirmNewPassword = true)
      : null;
    return errors;
  }
}
