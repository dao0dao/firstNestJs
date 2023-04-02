import { Controller, Get } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";

@Controller("services")
export class TennisServicesController {
  @Get()
  @Role("admin")
  getAllServices() {
    return [];
  }
}
