import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from "src/models/model/user/user.model";
import { UserController } from "./user.controller";
import { UserSQLService } from "../../../models/model/user/user-sql.service";
import { UserFactoryService } from "./user-factory.service";
import { UserCheckerService } from "./user-checker.service";

@Module({
  imports: [SequelizeModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserSQLService, UserFactoryService, UserCheckerService],
  exports: [UserSQLService],
})
export class UserModule {}
