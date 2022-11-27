import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PriceList } from "src/models/model/priceList.model";
import { PlayerModule } from "../player/player.module";
import { PriceListController } from "./price-list.controller";
import { PriceListService } from "./price-list.service";

@Module({
  imports: [SequelizeModule.forFeature([PriceList]), PlayerModule],
  controllers: [PriceListController],
  providers: [PriceListService],
})
export class PriceListModule {}
