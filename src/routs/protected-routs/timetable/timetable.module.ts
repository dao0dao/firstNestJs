import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableController } from "./timetable.controller";
import { TimetablePaymentFactoryService } from "./timetable-payment-factory.service";
import { PlayerModule } from "../player/player.module";
import { ModelsModule } from "src/models/models.module";
import { TimetablePlayerHistoryFactoryService } from "./timetable-player-history-factory.service";
import { TimetableCheckersService } from "./timetable-checker.service";
import { TimetableFacadeService } from "./timetable-facade.service";
import { TimetableParserService } from "./timetable-parser.service";
import { TimetableSetterService } from "./timetable-setter.service";

@Module({
  imports: [
    SequelizeModule.forFeature([Timetable]),
    PlayerModule,
    ModelsModule,
  ],
  controllers: [TimetableController],
  providers: [
    TimetablePaymentFactoryService,
    TimetablePlayerHistoryFactoryService,
    TimetableCheckersService,
    TimetableFacadeService,
    TimetableParserService,
    TimetableSetterService,
  ],
})
export class TimetableModule {}
