import { Controller, Get } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { TennisService } from "./tennis.service";

@Controller("services")
export class TennisServicesController {
  constructor(private service: TennisService) {}
  @Get()
  @Role("admin")
  getAllServices() {
    return this.service.getAllServices();
  }
}
