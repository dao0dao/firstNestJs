import {
  Controller,
  Get,
  Post,
  Req,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";
import { createPassword } from "src/utils/bcript";
import { AdministratorDataHandlerService } from "./administrator-data-handler.service";
import { AdministratorDTO } from "./administrator.dto";
import {
  AdministratorCreateErrors,
  AdministratorUpdateErrors,
} from "./administrator.interfaces";
import { AdministratorService } from "./administrator.service";

@Controller("administrator")
export class AdministratorController {
  constructor(
    private adminService: AdministratorService,
    private dataHandler: AdministratorDataHandlerService
  ) {}
  @Get()
  @Role("login")
  async getAdminData(@Req() req: RequestDTO) {
    const admin = await this.adminService.returnAdminNickAndNameByName(
      req.ADMIN_NAME
    );
    return admin;
  }

  @Post()
  @Role("login")
  async updateLoginAdmin(
    @Req() req: RequestDTO,
    @Body() body: AdministratorDTO
  ) {
    const allAdmins = await this.adminService.findAllAdministrators();
    const errors: AdministratorUpdateErrors =
      this.dataHandler.checkCanUpdateUser(req.ADMIN_ID, body, allAdmins);
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const admin = allAdmins.find((el) => el.id === req.ADMIN_ID);
    if (!admin) {
      throw new HttpException({ notAllowed: true }, HttpStatus.UNAUTHORIZED);
    }
    const result = await this.adminService.updateAdministrator(body, admin);
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
  async getAdministratorList() {
    const administrators = await this.adminService.findAllAdministrators();
    return { users: administrators };
  }

  @Post("create")
  @Role("admin")
  async createAdministrator(
    @Req() req: RequestDTO,
    @Body() body: AdministratorDTO
  ) {
    const allAdmins = await this.adminService.findAllAdministrators();
    const errors: AdministratorCreateErrors =
      this.dataHandler.checkCanAddAdministrator(body, allAdmins);
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
  }
}
