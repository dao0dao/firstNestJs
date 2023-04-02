import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { TennisServicesController } from "./tennis.services.controller";
import { TennisServie } from "./tennis.service";

@Module({
  controllers: [TennisServicesController],
  providers: [TennisServie],
  imports: [ModelsModule],
})
export class TennisServicesModule {}
