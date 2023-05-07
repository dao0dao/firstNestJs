import { Injectable } from "@nestjs/common";
import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";
import { RequestDTO } from "src/request.dto";
import { InputReservationPayment } from "./timetable.dto";

@Injectable()
export class TimetableCheckersService {
  checkCanChangePrice(
    role: RequestDTO["ROLE"],
    data: InputReservationPayment,
    history: PlayerHistory[]
  ) {
    if ("admin" === role) {
      return true;
    }
    const { playerOne, playerTwo } = data;
    if (playerOne?.id) {
      const h = history.find((el) => el.player_id === playerOne.id);
      if (!h) {
        return false;
      }
      if (parseFloat(h.price) !== playerOne.value) {
        return false;
      }
    }
    if (playerTwo?.id) {
      const h = history.find((el) => el.player_id === playerTwo.id);
      if (!h) {
        return false;
      }
      if (parseFloat(h.price) !== playerTwo.value) {
        return false;
      }
    }
    return true;
  }

  checkCanPayForReservation(
    role: RequestDTO["ROLE"],
    history: PlayerHistory[]
  ) {
    if ("admin" === role) {
      return true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (const h of history) {
      const date = new Date(h.service_date);
      date.setHours(0, 0, 0, 0);
      if (today > date) {
        return false;
      }
    }
    return true;
  }

  checkCanCreateOrUpdate(date: string, role: string) {
    if (role === "admin") {
      return true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }
}
