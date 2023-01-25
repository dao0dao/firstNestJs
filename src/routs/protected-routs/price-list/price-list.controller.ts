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
import { PriceListService } from "src/models/model/price-list/price-list.service";
import { OptionalPriceListHourValidationPipe } from "src/pipes/priceListHour-validator";
import { PriceListHandleDataService } from "./price-list-handle-data.service";
import { PriceListDTO, PriceListQueryDTO } from "./price-list.dto";

@Controller("price-list")
@UsePipes(OptionalPriceListHourValidationPipe)
export class PriceListController {
  constructor(
    private priceList: PriceListService,
    private handleData: PriceListHandleDataService
  ) {}

  @Get()
  @Role("admin")
  async getAllPriceLists() {
    const priceListModel = await this.priceList.getAllPriceList();
    const priceList = this.handleData.parsePriceListModelToDTO(priceListModel);
    return { priceList };
  }

  @Post()
  @Role("admin")
  async createPriceList(@Body() body: PriceListDTO) {
    const isWrongData = this.handleData.validateHoursAndDay(body);
    if (isWrongData) {
      throw new HttpException(
        { reason: "Błędne dane" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const id = await this.priceList.createPriceList(body);
    return { status: "created", id };
  }

  @Put("update/:id")
  @Role("admin")
  async updatePriceList(
    @Body() body: PriceListDTO,
    @Param() query: PriceListQueryDTO
  ) {
    const isWrongData = this.handleData.validateHoursAndDay(body);
    if (isWrongData) {
      throw new HttpException(
        { reason: "Błędne dane" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    await this.priceList.updatePriceList(body, query);
    return { status: "updated" };
  }

  @Delete("delete/:id")
  @Role("admin")
  async deletePriceList(@Param() query: PriceListQueryDTO) {
    await this.priceList.deletePriceList(query);
    return { status: "deleted" };
  }
}