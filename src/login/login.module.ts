import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";

@Module({
  imports: [SequelizeModule.forFeature([Administrator])],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
