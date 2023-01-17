import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableController } from "./timetable.controller";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import { PlayerModule } from "../player/player.module";
import { ModelsModule } from "src/models/models.module";

@Module({
  imports: [
    SequelizeModule.forFeature([Timetable]),
    PlayerModule,
    ModelsModule,
  ],
  controllers: [TimetableController],
  providers: [TimeTableHandleDataService],
})
export class TimetableModule {}
