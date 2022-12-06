import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { PriceListDTO, PriceListQueryDTO } from "./price-list.dto";
import { PriceListService } from "./price-list.service";

@Controller("price-list")
export class PriceListController {
  constructor(private priceList: PriceListService) {}

  @Get()
  @Role("admin")
  async getAllPriceLists() {
    const priceList = await this.priceList.getAllPriceList();
    return { priceList };
  }

  @Post()
  @Role("admin")
  async createPriceList(@Body() body: PriceListDTO) {
    const id = await this.priceList.createPriceList(body);
    return { status: "created", id };
  }

  @Put("update/:id")
  @Role("admin")
  async updatePriceList(
    @Body() body: PriceListDTO,
    @Param() query: PriceListQueryDTO
  ) {
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
