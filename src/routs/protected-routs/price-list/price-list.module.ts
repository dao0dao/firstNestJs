import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import { PriceList } from "src/models/model/priceList.model";
import { OptionalPriceListHourValidationPipe } from "src/pipes/priceListHour-validator";
import { PlayerModule } from "../player/player.module";
import { PriceListController } from "./price-list.controller";
import { PriceListService } from "./price-list.service";
import { PriceListHandleDataService } from "./price-list-handle-data.service";

@Module({
  imports: [SequelizeModule.forFeature([PriceList]), PlayerModule],
  controllers: [PriceListController],
  providers: [PriceListService, PriceListHandleDataService],
})
export class PriceListModule {}
