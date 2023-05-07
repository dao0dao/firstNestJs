import { Injectable } from "@nestjs/common";
import { PlayerService } from "src/models/model/player/player.service";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { RequestDTO } from "src/request.dto";
import { InputReservationDTO, TimetableIdParam } from "./timetable.dto";
import { countFromToTime } from "src/utils/time";
import { TimetablePlayerHistoryFactoryService } from "./timetable-player-history-factory.service";
import { TimetableCheckersService } from "./timetable-checker.service";
import { TimetableParserService } from "./timetable-parser.service";

@Injectable()
export class TimetableFacadeService {
  constructor(
    private timetableSQL: TimetableSQLService,
    private playerService: PlayerService,
    private timetablePlayerHistory: TimetablePlayerHistoryFactoryService,
    private settersCheckers: TimetableCheckersService,
    private timetableParser: TimetableParserService
  ) {}

  async getReservationByDate(date: string, role: string) {
    const timetableForDate = await this.timetableSQL.findAllReservationByDate(
      date
    );
    const reservations =
      await this.timetableParser.parseTimetableToReservationModelArray(
        timetableForDate,
        role
      );
    return reservations;
  }

  async createReservationAndPlayerHistory(
    role: RequestDTO["ROLE"],
    body: InputReservationDTO
  ) {
    const canCreate = this.settersCheckers.checkCanCreateOrUpdate(
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
    const reservation = await this.timetableSQL.addReservation(body, hourCount);
    if (!reservation) {
      return "intervalServerError";
    }
    return await this.timetablePlayerHistory.createPlayerHistory(reservation);
  }

  async updateReservation(role: RequestDTO["ROLE"], body: InputReservationDTO) {
    const canUpdate = this.settersCheckers.checkCanCreateOrUpdate(
      body.form.date,
      role
    );
    if (!canUpdate) {
      return "permissionDenied";
    }
    const hourCount = countFromToTime(body.form.timeFrom, body.form.timeTo);
    if (hourCount === "wrong_time_formate") {
      return "wrongTimeFormate";
    }
    const timetable = await this.timetableSQL.updateReservation(
      body,
      hourCount
    );
    if (timetable === null) {
      return "intervalServerError";
    }
    await this.timetablePlayerHistory.updatePlayerHistoryTimetable(timetable);
    const allPlayers = await this.playerService.findAllPlayers();
    const reservation = this.timetableParser.parseTimetableToReservation(
      timetable,
      allPlayers,
      role
    );
    return { reservation };
  }

  async deleteReservation(role: RequestDTO["ROLE"], param: TimetableIdParam) {
    const canDelete = this.settersCheckers.checkCanCreateOrUpdate(
      new Date().toString(),
      role
    );
    if (!canDelete) {
      return "accessDenied";
    }
    await this.timetablePlayerHistory.deletePlayerHistoryByTimetableId(
      param.id
    );
    await this.timetableSQL.deleteReservationById(param.id);
    return { status: "deleted" };
  }
}
