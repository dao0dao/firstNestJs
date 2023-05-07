import { Injectable } from "@nestjs/common";
import { PlayerService } from "src/models/model/player/player.service";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { TimetableService } from "./timetable.service";
import { RequestDTO } from "src/request.dto";
import { InputReservationDTO, TimetableIdParam } from "./timetable.dto";
import { countFromToTime } from "src/utils/time";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";

@Injectable()
export class TimetableFacadeService {
  constructor(
    private timetableSQL: TimetableSQLService,
    private timetable: TimetableService,
    private playerService: PlayerService,
    private timetableHandleHistory: TimetableHandlePlayerHistoryService
  ) {}

  async getReservationByDate(date: string, role: string) {
    const dailyTimetable = await this.timetableSQL.findAllReservationByDate(
      date
    );
    const reservations =
      await this.timetable.parseTimetableToReservationModelArray(
        dailyTimetable,
        role
      );
    return reservations;
  }

  async createReservationAndPlayerHistory(
    role: RequestDTO["ROLE"],
    body: InputReservationDTO
  ) {
    const canCreate = this.timetable.checkCanCreateOrUpdate(
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
    return await this.timetable.createPlayerHistoryForTimetable(reservation);
  }

  async updateReservation(role: RequestDTO["ROLE"], body: InputReservationDTO) {
    const canUpdate = this.timetable.checkCanCreateOrUpdate(
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
    await this.timetable.updatePlayerHistoryForTimetable(timetable);
    const allPlayers = await this.playerService.findAllPlayers();
    const reservation = this.timetable.parseTimetableToReservation(
      timetable,
      allPlayers,
      role
    );
    return { reservation };
  }

  async deleteReservation(role: RequestDTO["ROLE"], param: TimetableIdParam) {
    const canDelete = this.timetable.checkCanCreateOrUpdate(
      new Date().toString(),
      role
    );
    if (!canDelete) {
      return "accessDenied";
    }
    await this.timetableHandleHistory.deletePlayerHistoryByTimetableId(
      param.id
    );
    await this.timetableSQL.deleteReservationById(param.id);
    return { status: "deleted" };
  }
}
