import { Body, Controller, Delete, Get, Param, Patch } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { TennisService } from "./tennis.service";
import { ServiceDeleteParam, ServicesDTO } from "./tennis.service.dto";

@Controller("services")
export class TennisServicesController {
  constructor(private service: TennisService) {}
  @Get()
  @Role("login")
  getAllServices() {
    return this.service.getAllServices();
  }

  @Patch()
  @Role("admin")
  async updateAllServices(@Body() body: ServicesDTO) {
    const result = await this.service.updateAllServices(body.services);
    return result;
  }

  @Delete(":id")
  @Role("admin")
  async deleteService(@Param() param: ServiceDeleteParam) {
    await this.service.deleteServiceById(parseInt(param.id));
    return { deleted: true };
  }
}
