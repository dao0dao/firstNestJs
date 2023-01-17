import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistoryModelService } from "./model/player-history/player-history.service";
import { PlayerHistory } from "./model/player-history/playerHistory.model";

const sequelizeModels = [PlayerHistory];

@Module({
  imports: [SequelizeModule.forFeature(sequelizeModels)],
  providers: [PlayerHistoryModelService],
  exports: [PlayerHistoryModelService],
})
export class ModelsModule {}
