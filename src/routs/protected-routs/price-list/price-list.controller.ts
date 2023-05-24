import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { OptionalPriceListHourValidationPipe } from "src/pipes/priceListHour-validator.pipe";
import { PriceListDTO, PriceListQueryDTO } from "./price-list.dto";
import { PriceListValidationPipe } from "src/pipes/price-list-validation.pipe";
import { PriceListFactoryService } from "./price-list-factory.service";

@Controller("price-list")
@UsePipes(OptionalPriceListHourValidationPipe)
export class PriceListController {
  constructor(private priceList: PriceListFactoryService) {}

  @Get()
  @Role("login")
  getPriceLists() {
    return this.priceList.getPriceLists();
  }

  @Post()
  @Role("admin")
  @UsePipes(PriceListValidationPipe)
  async createPriceList(@Body() body: PriceListDTO) {
    const result = await this.priceList.createPriceList(body);
    if ("wrong_data" === result) {
      throw new HttpException(
        { reason: "Błędne dane" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    return result;
  }

  @Put("update/:id")
  @Role("admin")
  @UsePipes(PriceListValidationPipe)
  async updatePriceList(
    @Body() body: PriceListDTO,
    @Param() query: PriceListQueryDTO
  ) {
    const result = await this.priceList.updatePriceList(body, query);
    if ("wrong_data" === result) {
      throw new HttpException(
        { reason: "Błędne dane" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if ("no_list" === result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result;
  }

  @Delete("delete/:id")
  @Role("admin")
  deletePriceList(@Param() query: PriceListQueryDTO) {
    return this.priceList.deletePriceList(query);
  }
}
