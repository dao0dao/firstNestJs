import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistory } from "./playerHistory.model";
import { PlayerHistoryService } from "./player-history.service";

@Module({
  imports: [SequelizeModule.forFeature([PlayerHistory])],
  providers: [PlayerHistoryService],
  exports: [PlayerHistoryService],
})
export class PlayerHistoryModule {}
