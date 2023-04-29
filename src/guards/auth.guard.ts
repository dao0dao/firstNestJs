import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdministratorSQLService } from "src/routs/protected-routs/administrator/administrator-sql.service";
import { RequestDTO } from "src/request.dto";
import { SessionsService } from "src/utils/shared/session.service";
import { Response } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private sessionService: SessionsService,
    private adminService: AdministratorSQLService
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: RequestDTO = context.switchToHttp().getRequest();
    const requestRole: string | string[] = this.reflector.get<string[]>(
      "role",
      context.getHandler()
    );
    if (!requestRole) {
      return true;
    }
    const session_id: string = req.cookies.key;
    if (!session_id) {
      throw new UnauthorizedException();
    }
    const loginUser = await this.sessionService.findLoginUserBySessionId(
      session_id
    );
    if (!loginUser) {
      const res: Response = context.switchToHttp().getResponse();
      res.clearCookie("key");
      throw new HttpException({ session: "fail" }, HttpStatus.UNAUTHORIZED);
    }
    const registeredUser = await this.adminService.findUserById(
      loginUser.administrator_id
    );
    if (!registeredUser) {
      throw new UnauthorizedException();
    }
    req.ADMIN_NAME = registeredUser.name;
    req.ADMIN_ID = registeredUser.id;

    const roles = [];
    if (registeredUser.isAdmin) {
      roles.push("admin", "login");
      req.ROLE = "admin";
    } else {
      roles.push("login");
      req.ROLE = "login";
    }
    if (roles.includes(requestRole)) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
