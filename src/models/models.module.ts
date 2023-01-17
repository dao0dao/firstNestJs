import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistoryModelService } from "./model/player-history/player-history.service";
import { modelsForRoot } from "./modelsForRoot";
import { TimetableService } from "./model/timetable/timetable.service";

const models = [PlayerHistoryModelService, TimetableService];

@Module({
  imports: [SequelizeModule.forFeature(modelsForRoot)],
  providers: models,
  exports: models,
})
export class ModelsModule {}
