import { Injectable } from "@nestjs/common";
import { UserDTO } from "./user.dto";
import { UserSQLService } from "../../../models/model/user/user-sql.service";
import { UserCheckerService } from "./user-checker.service";

@Injectable()
export class UserFactoryService {
  constructor(
    private userSQL: UserSQLService,
    private userChecker: UserCheckerService
  ) {}

  async createUser(body: UserDTO) {
    const result = await this.userChecker.checkCanAddUser(body);
    if ("canCreate" !== result) {
      return result;
    }
    const user = await this.userSQL.createUser(body);
    if (!user) {
      return "readWrite";
    }
    return true;
  }

  async updateLoginUser(id: string, body: UserDTO) {
    const result = await this.userChecker.checkCanUpdateLoginUser(id, body);
    if ("canUpdate" !== result) {
      return result;
    }
    const user = await this.userSQL.updateUserById(id, body);
    if (!user) {
      return "readWrite";
    }
    return true;
  }

  async updateUser(id: string, body: UserDTO) {
    const result = await this.userChecker.checkCanUpdateUser(id, body);
    if ("canUpdate" !== result) {
      return result;
    }
    const user = await this.userSQL.updateUserById(id, body);
    if (!user) {
      return "readWrite";
    }
    return true;
  }

  async deleteUser(id: string) {
    const user = await this.userSQL.findUserWithoutSuperAdminById(id);
    if (!user) {
      return false;
    }
    return user.destroy().then(() => true);
  }
}
