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
    const allPlayers = await this.playerService.findAllPlayers();
    const reservations = this.timetable.parseTimetableToReservationModelArray(
      dailyTimetable,
      allPlayers,
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
}
