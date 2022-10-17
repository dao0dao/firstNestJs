import { Controller, Get, Req } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";

@Controller("administrator")
export class AdministratorController {
  @Get()
  @Role("login")
  getAdminData(@Req() req: RequestDTO) {
    console.log(req.ADMIN_NAME);
    console.log(req.ROLE);
    return { status: "ok" };
  }
}
