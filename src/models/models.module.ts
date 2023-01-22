import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistoryModelService } from "./model/player-history/player-history.service";
import { modelsForRoot } from "./modelsForRoot";
import { TimetableService } from "./model/timetable/timetable.service";
import { PriceListService } from "./model/price-list/price-list.service";
import { PlayerService } from "./model/player/player.service";
import { PlayerAccountService } from "./model/player-account/player-account.service";

const models = [
  PlayerHistoryModelService,
  TimetableService,
  PriceListService,
  PlayerService,
  PlayerAccountService,
];

@Module({
  imports: [SequelizeModule.forFeature(modelsForRoot)],
  providers: models,
  exports: models,
})
export class ModelsModule {}
