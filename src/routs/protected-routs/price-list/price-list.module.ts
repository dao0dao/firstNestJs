import { Module } from "@nestjs/common";
import { PriceListController } from "./price-list.controller";
import { PriceListHandleDataService } from "./price-list-handle-data.service";
import { ModelsModule } from "src/models/models.module";

@Module({
  imports: [ModelsModule],
  controllers: [PriceListController],
  providers: [PriceListHandleDataService],
})
export class PriceListModule {}
