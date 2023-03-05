import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableController } from "./timetable.controller";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import { PlayerModule } from "../player/player.module";
import { ModelsModule } from "src/models/models.module";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import { FactoryDataTimetablePlayerHistory } from "./factory data-timetable-player-history";

@Module({
  imports: [
    SequelizeModule.forFeature([Timetable]),
    PlayerModule,
    ModelsModule,
  ],
  controllers: [TimetableController],
  providers: [
    TimeTableHandleDataService,
    TimetableHandlePlayerHistoryService,
    FactoryDataTimetablePlayerHistory,
  ],
})
export class TimetableModule {}
