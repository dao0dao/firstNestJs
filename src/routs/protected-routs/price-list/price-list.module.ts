import { Module } from "@nestjs/common";
import { PriceListController } from "./price-list.controller";
import { PriceListValidationService } from "./price-list-validation.service";
import { ModelsModule } from "src/models/models.module";
import { PriceListFactoryService } from "./price-list-factory.service";

@Module({
  imports: [ModelsModule],
  controllers: [PriceListController],
  providers: [PriceListValidationService, PriceListFactoryService],
})
export class PriceListModule {}
