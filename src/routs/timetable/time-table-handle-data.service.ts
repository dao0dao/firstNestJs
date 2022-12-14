import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player.models";
import { Timetable } from "src/models/model/timetable.model";
import { RequestDTO } from "src/request.dto";
import { InputReservationDTO } from "./timetable.dto";

@Injectable()
export class TimeTableHandleDataService {
  parseDailyTimeTableToReservation(
    allPlayers: Player[],
    timetable: Timetable[],
    role: RequestDTO["ROLE"]
  ) {
    const reservations: InputReservationDTO[] = [];
    return reservations;
  }
}
