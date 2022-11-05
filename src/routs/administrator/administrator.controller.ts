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
import { AdministratorDataHandlerService } from "./administrator-data-handler.service";
import { AdministratorDTO } from "./administrator.dto";
import {
  AdministratorCreateErrors,
  AdministratorUpdateErrors,
  LoginAdministratorUpdateErrors,
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
    const errors: LoginAdministratorUpdateErrors =
      this.dataHandler.checkCanUpdateLoginAdministrator(
        req.ADMIN_ID,
        body,
        allAdmins
      );
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
    const result = await this.adminService.createAdministrator(body);
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
  async getListOfAdministrators() {
    const admins = await this.adminService.findAllAdministrators();
    return { user: admins };
  }

  @Post("update/:id")
  @Role("admin")
  async updateAdministrator(
    @Param("id") admin_id: string,
    @Body() body: AdministratorDTO
  ) {
    const allAdmins = await this.adminService.findAllAdministrators();
    const errors: AdministratorUpdateErrors =
      this.dataHandler.checkCanUpdateAdministrator(admin_id, body, allAdmins);
    if (Object.keys(errors).length > 0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    const editedAdmin = allAdmins.find((el) => el.id === admin_id);
    const result = await this.adminService.updateAdministrator(
      body,
      editedAdmin
    );
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
  async deleteAdministrator(@Param("id") admin_id: string) {
    if (!admin_id) {
      throw new HttpException("Bad id", HttpStatus.BAD_REQUEST);
    }
    const admin = await this.adminService.findAdministratorById(admin_id);
    return await admin
      .destroy()
      .then(() => {
        return { deleted: true };
      })
      .catch(
        () =>
          new HttpException(
            { readWrite: "fail" },
            HttpStatus.INTERNAL_SERVER_ERROR
          )
      );
  }
}
