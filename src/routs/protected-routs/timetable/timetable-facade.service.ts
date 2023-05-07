import { Injectable } from "@nestjs/common";
import { PlayerService } from "src/models/model/player/player.service";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { TimetableService } from "./timetable.service";
import { RequestDTO } from "src/request.dto";
import { InputReservationDTO } from "./timetable.dto";
import { countFromToTime } from "src/utils/time";

@Injectable()
export class TimetableFacadeService {
  constructor(
    private timetableSQL: TimetableSQLService,
    private timetable: TimetableService,
    private playerService: PlayerService
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
}
