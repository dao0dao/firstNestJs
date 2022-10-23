import { Injectable } from "@nestjs/common";
import { Administrator } from "src/models/model/administrator.model";
import { AdministratorDTO } from "./administrator.dto";
import { AdministratorUpdateErrors } from "./administrator.interfaces";

@Injectable()
export class AdministratorDataHandlerService {
  checkCanUpdateUser(
    admin_id: string,
    admin: AdministratorDTO,
    allAdmins: Administrator[]
  ) {
    const errors = {} as AdministratorUpdateErrors;
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
}
