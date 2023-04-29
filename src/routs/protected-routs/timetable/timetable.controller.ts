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
import { PlayerService } from "src/models/model/player/player.service";
import { PriceListService } from "src/models/model/price-list/price-list.service";
import { TimetableService } from "src/models/model/timetable/timetable.service";
import { RequestDTO } from "src/request.dto";
import { countFromToTime } from "src/utils/time";
import { TimeTableHandleDataService } from "./time-table-handle-data.service";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import {
  CreateReservationDTO,
  InputReservationDTO,
  InputReservationPayment,
  InputUpdateReservationDTO,
  OutputReservationDTO,
  OutputReservationPrice,
  TimetableIdParam,
  TimetableQuery,
} from "./timetable.dto";

@Controller("timetable")
export class TimetableController {
  constructor(
    private timetable: TimetableService,
    private playerService: PlayerService,
    private timetableHandleData: TimeTableHandleDataService,
    private timetableHandleHistory: TimetableHandlePlayerHistoryService,
    private priceList: PriceListService
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
    const hourCount = countFromToTime(body.form.timeFrom, body.form.timeTo);
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
    const priceList = await this.priceList.getAllPriceList();
    let playerOne = undefined;
    let playerTwo = undefined;
    if (reservation.player_one) {
      playerOne = {
        id: reservation.player_one,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          reservation.player_one
        ),
      };
    }
    if (reservation.player_two) {
      playerTwo = {
        id: reservation.player_two,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          reservation.player_two
        ),
      };
    }
    const playersHistory =
      await this.timetableHandleHistory.createPlayerHistory(
        reservation,
        priceList,
        { playerOne, playerTwo }
      );
    return {
      status: "created",
      playersHistory,
    };
  }

  @Put("reservation/update")
  @Role("login")
  async updateReservation(
    @Req() req: RequestDTO,
    @Body() body: InputUpdateReservationDTO
  ): Promise<{
    reservation: OutputReservationDTO;
    playersHistory: boolean | { playerTwo?: boolean; playerOne?: boolean };
  }> {
    const canUpdate = this.timetableHandleData.checkCanCreateOrUpdate(
      body.form.date,
      req.ROLE
    );
    if (!canUpdate) {
      throw new HttpException(
        { reason: "Brak uprawnień." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const hourCount = countFromToTime(body.form.timeFrom, body.form.timeTo);
    if (hourCount === "wrong_time_formate") {
      throw new HttpException(
        { reason: "Błędny format godziny" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const timetable = await this.timetable.updateReservation(body, hourCount);
    if (timetable === null) {
      throw new HttpException(
        { reason: "Brak rezerwacji lub nie podano gracza" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const priceList = await this.priceList.getAllPriceList();
    let playerOne = undefined;
    let playerTwo = undefined;
    if (timetable.player_one) {
      playerOne = {
        id: timetable.player_one,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          timetable.player_one
        ),
      };
    }
    if (timetable.player_two) {
      playerTwo = {
        id: timetable.player_two,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          timetable.player_two
        ),
      };
    }
    const playersHistory =
      await this.timetableHandleHistory.updatePlayerHistoryTimetable(
        timetable,
        priceList,
        {
          playerOne,
          playerTwo,
        }
      );
    const allPlayers = await this.playerService.findAllPlayers();
    const reservation = this.timetableHandleData.parseTimetableToReservation(
      timetable,
      allPlayers,
      req.ROLE
    );
    return { reservation: reservation, playersHistory };
  }

  @Delete("reservation/delete/:id")
  @Role("login")
  async deleteReservation(
    @Req() req: RequestDTO,
    @Param() param: TimetableIdParam
  ) {
    const canDelete = this.timetableHandleData.checkCanCreateOrUpdate(
      new Date().toString(),
      req.ROLE
    );
    if (!canDelete) {
      throw new HttpException(
        { reason: "Brak uprawnień" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    await this.timetableHandleHistory.deletePlayerHistoryByTimetableId(
      param.id
    );
    return this.timetable.deleteReservationById(param.id);
  }

  @Get("reservation/price/:id")
  @Role("login")
  async getReservationPrice(
    @Param() param: TimetableIdParam
  ): Promise<OutputReservationPrice> {
    const data = await this.timetableHandleHistory.getReservationPrice(
      param.id
    );
    return { prices: data };
  }

  @Post("reservation/pay")
  @Role("login")
  async payForReservations(
    @Req() req: RequestDTO,
    @Body() body: InputReservationPayment
  ) {
    const result =
      await this.timetableHandleHistory.payForPlayerHistoryTimetable(req, body);
    if (result.access_denied) {
      throw new HttpException(
        { reason: "Brak uprawnień." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if (result.wrong_value) {
      throw new HttpException(
        { reason: "Brak uprawnień do zmiany kwoty." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    return { updated: true };
  }
}
