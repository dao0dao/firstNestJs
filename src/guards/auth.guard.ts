import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdministratorService } from "src/routs/protected-routs/administrator/administrator.service";
import { RequestDTO } from "src/request.dto";
import { SessionsService } from "src/utils/shared/session.service";
import { Response } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionsService,
    private adminService: AdministratorService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestDTO = context.switchToHttp().getRequest();
    const role: string | string[] = this.reflector.get<string[]>(
      "role",
      context.getHandler()
    );
    if (!role) {
      return true;
    }
    const session_id: string = req.cookies.key;
    if (!session_id) {
      throw new UnauthorizedException();
    }
    const adminModel = await this.sessionService.findAdminIdInSession(
      session_id
    );
    if (!adminModel) {
      const res: Response = context.switchToHttp().getResponse();
      res.clearCookie("key");
      throw new HttpException({ session: "fail" }, HttpStatus.UNAUTHORIZED);
    }
    const admin = await this.adminService.findAdministratorById(
      adminModel.administrator_id
    );
    if (!admin) {
      throw new UnauthorizedException();
    }
    req.ADMIN_NAME = admin.name;
    req.ADMIN_ID = admin.id;

    const roles = [];
    if (admin.isAdmin) {
      roles.push("admin", "login");
      req.ROLE = "admin";
    } else {
      roles.push("login");
      req.ROLE = "login";
    }
    if (roles.includes(role)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
