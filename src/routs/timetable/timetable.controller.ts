import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  Body,
  Put,
  Delete,
  Param,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";
import { PlayerService } from "../player/player.service";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import {
  CreateReservationDTO,
  InputReservationDTO,
  InputUpdateReservationDTO,
  OutputReservationDTO,
  TimetableDeleteParam,
  TimetableQuery,
} from "./timetable.dto";
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
  ): Promise<{ reservations: OutputReservationDTO[] }> {
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
      this.timetableHandleData.parseTimetableToReservationModelArray(
        dailyTimetable,
        allPlayers,
        req.ROLE
      );
    return {
      reservations,
    };
  }

  @Post("reservation/add")
  @Role("login")
  async addReservation(
    @Req() req: RequestDTO,
    @Body() body: InputReservationDTO
  ): Promise<CreateReservationDTO> {
    const canCreate = this.timetableHandleData.checkCanCreateOrUpdate(
      body.form.date,
      req.ROLE
    );
    if (!canCreate) {
      throw new HttpException(
        { reason: "Brak uprawnień, nie można dodać z datą wsteczną." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const hourCount = this.timetableHandleData.countTime(
      body.form.timeFrom,
      body.form.timeTo
    );
    if (hourCount === "wrong_time_formate") {
      throw new HttpException(
        { reason: "Błędny format godziny" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const reservation = await this.timetable.addReservation(body, hourCount);
    if (!reservation) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return {
      status: "created",
    };
  }

  @Put("reservation/update")
  @Role("login")
  async updateReservation(
    @Req() req: RequestDTO,
    @Body() body: InputUpdateReservationDTO
  ): Promise<{ reservation: OutputReservationDTO }> {
    const canCreate = this.timetableHandleData.checkCanCreateOrUpdate(
      body.form.date,
      req.ROLE
    );
    if (!canCreate) {
      throw new HttpException(
        { reason: "Brak uprawnień, nie można dodać z datą wsteczną." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const hourCount = this.timetableHandleData.countTime(
      body.form.timeFrom,
      body.form.timeTo
    );
    if (hourCount === "wrong_time_formate") {
      throw new HttpException(
        { reason: "Błędny format godziny" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const timetable = await this.timetable.updateReservation(body, hourCount);
    const allPlayers = await this.playerService.findAllPlayers();
    const reservation = this.timetableHandleData.parseTimetableToReservation(
      timetable,
      allPlayers,
      req.ROLE
    );
    return { reservation: reservation };
  }

  @Delete("reservation/delete/:id")
  @Role("login")
  deleteReservation(@Param() param: TimetableDeleteParam) {
    console.log(param);
    return;
  }
}
