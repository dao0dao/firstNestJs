import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { ServicesController } from "./services.controller";
import { ServicesService } from "./services.service";

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [ModelsModule],
})
export class ServicesModule {}
