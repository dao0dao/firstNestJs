import { Injectable } from "@nestjs/common";
import { PlayerService } from "src/models/model/player/player.service";
import { PriceListService } from "src/models/model/price-list/price-list.service";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { TimeTableHandleDataService } from "./timetable.service";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import { RequestDTO } from "src/request.dto";
import { InputReservationDTO } from "./timetable.dto";
import { countFromToTime } from "src/utils/time";

@Injectable()
export class TimetableFacadeService {
  constructor(
    private timetable: TimetableSQLService,
    private playerService: PlayerService,
    private timetableHandleData: TimeTableHandleDataService,
    private timetableHandleHistory: TimetableHandlePlayerHistoryService,
    private priceList: PriceListService
  ) {}

  async getReservationByDate(date: string, role: string) {
    const dailyTimetable = await this.timetable.findAllReservationByDate(date);
    const allPlayers = await this.playerService.findAllPlayers();
    const reservations =
      this.timetableHandleData.parseTimetableToReservationModelArray(
        dailyTimetable,
        allPlayers,
        role
      );
    return reservations;
  }

  async createReservation(role: RequestDTO["ROLE"], body: InputReservationDTO) {
    const canCreate = this.timetableHandleData.checkCanCreateOrUpdate(
      body.form.date,
      role
    );
    if (!canCreate) {
      return "permissionDenied";
    }
    const hourCount = countFromToTime(body.form.timeFrom, body.form.timeTo);
    if (hourCount === "wrong_time_formate") {
      return "wrongTimeFormate";
    }
    const reservation = await this.timetable.addReservation(body, hourCount);
    if (!reservation) {
      return "intervalServerError";
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
    return { playersHistory };
  }
}
