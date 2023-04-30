import {
  Controller,
  Get,
  Post,
  Delete,
  Req,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";
import { AdministratorService } from "./administrator.service";
import { AdministratorDTO, AdministratorQuery } from "./administrator.dto";
import {
  AdministratorCreateErrors,
  AdministratorUpdateErrors,
  LoginAdministratorUpdateErrors,
} from "./administrator.interfaces";
import { UserSQLService } from "../../../models/model/user/user.service";

@Controller("administrator")
export class AdministratorController {
  constructor(
    private adminSQL: UserSQLService,
    private adminService: AdministratorService
  ) {}
  @Get()
  @Role("login")
  async getUserData(@Req() req: RequestDTO) {
    const admin = await this.adminSQL.returnUserNameByLoginName(req.ADMIN_NAME);
    return admin;
  }

  @Post()
  @Role("login")
  async updateLoginAdmin(
    @Req() req: RequestDTO,
    @Body() body: AdministratorDTO
  ) {
    const errors: LoginAdministratorUpdateErrors =
      await this.adminService.checkCanUpdateLoginUser(req.ADMIN_ID, body);
    if (errors.notExist) {
      throw new HttpException({ notAllowed: true }, HttpStatus.UNAUTHORIZED);
    } else if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.adminSQL.updateUserById(req.ADMIN_ID, body);
    if (!result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { update: true };
  }

  @Get("list")
  @Role("admin")
  async getUserList() {
    const administrators = await this.adminSQL.findAllUsers();
    return { users: administrators };
  }

  @Post("create")
  @Role("admin")
  async createAdministrator(@Body() body: AdministratorDTO) {
    const errors: AdministratorCreateErrors =
      await this.adminService.checkCanAddUser(body);
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.adminSQL.createUser(body);
    if (!result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { created: true };
  }

  @Get("list")
  @Role("admin")
  async getListOfUsers() {
    const users = await this.adminSQL.findAllUsers();
    return { user: users };
  }

  @Post("update/:id")
  @Role("admin")
  async updateAdministrator(
    @Param() query: AdministratorQuery,
    @Body() body: AdministratorDTO
  ) {
    const errors: AdministratorUpdateErrors =
      await this.adminService.checkCanUpdateUser(query.id, body);
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.adminSQL.updateUserById(query.id, body);
    if (!result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { update: true };
  }

  @Delete("delete/:id")
  @Role("admin")
  async deleteAdministrator(@Param() query: AdministratorQuery) {
    if (!query) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
    const result = this.adminService.deleteUser(query.id);
    if (!result) {
      new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    } else {
      return { deleted: true };
    }
  }
}
