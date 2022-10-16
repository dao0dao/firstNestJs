import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Administrator } from "src/models/model/administrator.model";
import { SharedModule } from "src/utils/shared/shared.module";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { LogoutController } from "./logout.controller";

@Module({
  imports: [SequelizeModule.forFeature([Administrator]), SharedModule],
  controllers: [LoginController, LogoutController],
  providers: [LoginService],
})
export class LoginModule {}
