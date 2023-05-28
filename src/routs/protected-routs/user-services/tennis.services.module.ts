import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { TennisServicesController } from "./tennis.services.controller";
import { UserServicesService } from "./user-services.service";

@Module({
  controllers: [TennisServicesController],
  providers: [UserServicesService],
  imports: [ModelsModule],
})
export class TennisServicesModule {}
