import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models/model/user/user.model";
import { AdministratorController } from "./administrator.controller";
import { UserSQLService } from "../../../models/model/user/user.service";
import { AdministratorService } from "./administrator.service";

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [AdministratorController],
  providers: [UserSQLService, AdministratorService],
  exports: [UserSQLService],
})
export class AdministratorModule {}
