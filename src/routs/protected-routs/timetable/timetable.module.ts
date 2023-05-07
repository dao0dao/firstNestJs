import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableController } from "./timetable.controller";
import { TimetableService } from "./timetable.service";
import { PlayerModule } from "../player/player.module";
import { ModelsModule } from "src/models/models.module";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import { TimetableCheckersFactoryService } from "./timetable-checker-factory.service";
import { TimetableFacadeService } from "./timetable-facade.service";
import { TimetableParserService } from "./timetable-parser.service";
import { TimetableSetterService } from "./timetable-setter-factory.service";

@Module({
  imports: [
    SequelizeModule.forFeature([Timetable]),
    PlayerModule,
    ModelsModule,
  ],
  controllers: [TimetableController],
  providers: [
    TimetableService,
    TimetableHandlePlayerHistoryService,
    TimetableCheckersFactoryService,
    TimetableFacadeService,
    TimetableParserService,
    TimetableSetterService,
  ],
})
export class TimetableModule {}
