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
import { UserServicesService } from "./user-services.service";
import {
  ServiceDeleteParam,
  ServicePaymentDTO,
  ServicesDTO,
} from "./tennis.service.dto";
import { RequestDTO } from "src/request.dto";

@Controller("services")
export class TennisServicesController {
  constructor(private userServices: UserServicesService) {}
  @Get()
  @Role("login")
  getAllServices() {
    return this.userServices.getUserServices();
  }

  @Patch()
  @Role("admin")
  async updateAllServices(@Body() body: ServicesDTO) {
    const result = await this.userServices.updateUserServices(body.services);
    return result;
  }

  @Delete(":id")
  @Role("admin")
  async deleteService(@Param() param: ServiceDeleteParam) {
    await this.userServices.deleteUserServiceById(parseInt(param.id));
    return { deleted: true };
  }

  @Post("account")
  @Role("login")
  async handleService(@Body() body: ServicePaymentDTO, @Req() req: RequestDTO) {
    const result = await this.userServices.payForService(body, req.ADMIN_NAME);
    if (result === true) {
      return { status: 201, message: "updated" };
    } else {
      let reason = "";
      switch (result) {
        case "accountChargeFail":
          reason = "Nie można doładować konta";
          break;
        case "accountSubtractFail":
          reason = "Nie można pobrać z konta";
          break;
        case "createHistoryFail":
          reason = "Nie można stworzyć wpisu historii";
          break;
      }
      throw new HttpException({ reason }, HttpStatus.NOT_ACCEPTABLE);
    }
  }
}
