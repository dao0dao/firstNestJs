import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { TennisService } from "./tennis.service";
import {
  ServiceDeleteParam,
  ServicePaymentDTO,
  ServicesDTO,
} from "./tennis.service.dto";
import { RequestDTO } from "src/request.dto";

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

  @Post("account")
  @Role("login")
  async handleService(@Body() body: ServicePaymentDTO, @Req() req: RequestDTO) {
    const result = await this.service.handleService(body, req.ADMIN_NAME);
    if (result === true) {
      return { status: 201, message: "updated" };
    } else {
      let reason = "";
      if (result.accountChargeFail) {
        reason = "Nie można doładować konta";
      }
      if (result.accountSubtractFail) {
        reason = "Nie można pobrać z konta";
      }
      if (result.createHistoryFail) {
        reason = "Nie można stworzyć wpisu historii";
      }
      throw new HttpException({ reason }, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
