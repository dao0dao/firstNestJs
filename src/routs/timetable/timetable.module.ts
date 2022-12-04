import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable.model";
import { TimetableController } from "./timetable.controller";
import { TimetableService } from "./timetable.service";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import { PlayerModule } from "../player/player.module";

@Module({
  imports: [SequelizeModule.forFeature([Timetable]), PlayerModule],
  controllers: [TimetableController],
  providers: [TimetableService, TimeTableHandleDataService],
})
export class TimetableModule {}
