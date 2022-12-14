import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Body,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";
import { PlayerService } from "../player/player.service";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import { InputReservationDTO, TimetableQuery } from "./timetable.dto";
import { TimetableService } from "./timetable.service";

@Controller("timetable")
export class TimetableController {
  constructor(
    private timetable: TimetableService,
    private playerService: PlayerService,
    private timetableHandleData: TimeTableHandleDataService
  ) {}

  @Get()
  @Role("login")
  async getReservationByDate(
    @Req() req: RequestDTO,
    @Query() query: TimetableQuery
  ) {
    if (!query.date) {
      throw new HttpException(
        { reason: "Nie prawidłowa data" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const dailyTimetable = await this.timetable.findAllReservationByDate(
      query.date
    );
    const allPlayers = await this.playerService.findAllPlayers();
    const reservations =
      this.timetableHandleData.parseDailyTimeTableToReservation(
        allPlayers,
        dailyTimetable,
        req.ROLE
      );
    return {
      reservations,
    };
  }

  @Post("reservation-add")
  @Role("login")
  async addReservation(@Body() body: InputReservationDTO) {
    return { status: "ok" };
  }
}
