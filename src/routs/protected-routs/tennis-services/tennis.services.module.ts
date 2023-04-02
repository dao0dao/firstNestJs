import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { TennisServicesController } from "./tennis.services.controller";
import { TennisService } from "./tennis.service";

@Module({
  controllers: [TennisServicesController],
  providers: [TennisService],
  imports: [ModelsModule],
})
export class TennisServicesModule {}
