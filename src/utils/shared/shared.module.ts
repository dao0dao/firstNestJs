import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Sessions } from "src/models/model/session.model";
import { SessionsService } from "./session.service";

@Module({
  imports: [SequelizeModule.forFeature([Sessions])],
  providers: [SessionsService],
  exports: [SessionsService],
})
export class SharedModule {}
