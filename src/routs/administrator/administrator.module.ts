import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { AdministratorController } from "./administrator.controller";
import { AdministratorService } from "./administrator.service";
import { AdministratorDataHandlerService } from "./administrator-data-handler.service";

@Module({
  imports: [SequelizeModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService, AdministratorDataHandlerService],
  exports: [AdministratorService],
})
export class AdministratorModule {}
