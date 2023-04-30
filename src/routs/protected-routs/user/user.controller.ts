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
import { UserService } from "./user.service";
import { UserDTO, UserQuery } from "./user.dto";
import {
  UserCreateErrors,
  UserUpdateErrors,
  LoginUserUpdateErrors,
} from "./user.interfaces";
import { UserSQLService } from "../../../models/model/user/user-sql.service";

@Controller("user")
export class UserController {
  constructor(
    private userSQL: UserSQLService,
    private userService: UserService
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
    const errors: LoginUserUpdateErrors =
      await this.userService.checkCanUpdateLoginUser(req.ADMIN_ID, body);
    if (errors.notExist) {
      throw new HttpException({ notAllowed: true }, HttpStatus.UNAUTHORIZED);
    } else if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.userSQL.updateUserById(req.ADMIN_ID, body);
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
  async getListOfUsers() {
    const users = await this.userSQL.findAllUsers();
    return { users };
  }

  @Post("create")
  @Role("admin")
  async createUser(@Body() body: UserDTO) {
    const errors: UserCreateErrors = await this.userService.checkCanAddUser(
      body
    );
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.userSQL.createUser(body);
    if (!result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { created: true };
  }

  @Post("update/:id")
  @Role("admin")
  async updateUser(@Param() query: UserQuery, @Body() body: UserDTO) {
    const errors: UserUpdateErrors = await this.userService.checkCanUpdateUser(
      query.id,
      body
    );
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const result = await this.userSQL.updateUserById(query.id, body);
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
  async deleteUser(@Param() query: UserQuery) {
    if (!query) {
      throw new HttpException("Bad request", HttpStatus.BAD_REQUEST);
    }
    const result = this.userService.deleteUser(query.id);
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
