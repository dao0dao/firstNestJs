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
import { UserFactoryService } from "./user-factory.service";
import { UserDTO, UserQuery } from "./user.dto";
import {
  LoginUserUpdateErrors,
  UserCreateErrors,
  UserUpdateErrors,
} from "./user.interfaces";
import { UserSQLService } from "../../../models/model/user/user-sql.service";

@Controller("user")
export class UserController {
  constructor(
    private userSQL: UserSQLService,
    private userFactory: UserFactoryService
  ) {}
  @Get()
  @Role("login")
  async getUserData(@Req() req: RequestDTO) {
    const admin = await this.userSQL.returnUserNameByLoginName(req.ADMIN_NAME);
    return admin;
  }

  @Post()
  @Role("login")
  async updateLoginUser(@Req() req: RequestDTO, @Body() body: UserDTO) {
    const result = await this.userFactory.updateLoginUser(req.ADMIN_ID, body);
    if (result === true) {
      return { updated: true };
    }
    if ("readWrite" === result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const errors = {} as LoginUserUpdateErrors;
    switch (result) {
      case "notExist":
        errors.notExist = true;
        break;
      case "passwordNotMatch":
        errors.passwordNotMatch = true;
        break;
      case "reservedLogin":
        errors.reservedLogin = true;
        break;
      case "reservedName":
        errors.reservedName = true;
    }
    throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  }

  @Get("list")
  @Role("admin")
  async getListOfUsers() {
    const users = await this.userSQL.findAllUsers();
    return { users };
  }

  @Post("create")
  @Role("admin")
  async createUser(@Body() body: UserDTO) {
    const result = await this.userFactory.createUser(body);
    if (true === result) {
      return { created: true };
    }
    if ("readWrite" === result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const errors = {} as UserCreateErrors;
    switch (result) {
      case "canNotCreateUser":
        errors.canNotCreateUser = true;
        break;
      case "passwordDoesNotMatch":
        errors.passwordDoesNotMatch = true;
        break;
    }
    throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  }

  @Post("update/:id")
  @Role("admin")
  async updateUser(@Param() query: UserQuery, @Body() body: UserDTO) {
    const result = await this.userFactory.updateUser(query.id, body);
    if (true === result) {
      return { update: true };
    }
    if ("readWrite" === result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    const errors = {} as UserUpdateErrors;
    switch (result) {
      case "wrongId":
        errors.id = true;
        break;
      case "wrongPassword":
        errors.confirmNewPassword = true;
        break;
      case "reservedName":
        errors.name = true;
        break;
      case "reservedLogin":
        errors.reservedLogin = true;
        break;
    }
    throw new HttpException(errors, HttpStatus.BAD_REQUEST);
  }

  @Delete("delete/:id")
  @Role("admin")
  async deleteUser(@Param() query: UserQuery) {
    if (!query) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
    const result = this.userFactory.deleteUser(query.id);
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
