import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistory } from "./playerHistory.model";
import { PlayerHistoryModelService } from "./player-history.service";

@Module({
  imports: [SequelizeModule.forFeature([PlayerHistory])],
  providers: [PlayerHistoryModelService],
  exports: [PlayerHistoryModelService],
})
export class PlayerHistoryModelModule {}
