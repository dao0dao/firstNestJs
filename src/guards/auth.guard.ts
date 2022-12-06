import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AdministratorService } from "src/routs/administrator/administrator.service";
import { RequestDTO } from "src/request.dto";
import { SessionsService } from "src/utils/shared/session.service";

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
    console.log(role);
    if (!role) {
      console.log(0);
      return true;
    }
    const session_id: string = req.cookies.key;
    if (!session_id) {
      console.log(1);
      throw new UnauthorizedException();
    }
    const admin_id = await this.sessionService.findAdminIdInSession(session_id);
    if (!admin_id) {
      console.log(2);
      throw new HttpException({ session: "fail" }, HttpStatus.UNAUTHORIZED);
    }
    const admin = await this.adminService.findAdministratorById(admin_id);
    if (!admin) {
      console.log(3);
      throw new UnauthorizedException();
    }
    req.ADMIN_NAME = admin.name;
    req.ADMIN_ID = admin.id;

    const roles = [];
    if (admin.isAdmin) {
      console.log(4);
      roles.push("admin", "login");
      req.ROLE = "admin";
    } else {
      console.log(5);
      roles.push("login");
      req.ROLE = "login";
    }
    if (roles.includes(role)) {
      console.log(6);
      return true;
    } else {
      console.log(7);
      throw new UnauthorizedException();
    }
  }
}
