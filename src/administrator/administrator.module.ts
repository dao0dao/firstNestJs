import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { AdministratorController } from "./administrator.controller";
import { AdministratorService } from "./administrator.service";

@Module({
  imports: [SequelizeModule.forFeature([Administrator])],
  controllers: [AdministratorController],
  providers: [AdministratorService],
  exports: [AdministratorService],
})
export class AdministratorModule {}