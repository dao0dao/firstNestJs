import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player.models";
import { Timetable } from "src/models/model/timetable.model";
import { OutputReservationDTO, ReservationPlayerDTO } from "./timetable.dto";

@Injectable()
export class TimeTableHandleDataService {
  private timeToNumber(data: string) {
    const RegEx = /^\d{2}:\d{2}$/;
    if (!data.match(RegEx)) {
      return "wrong_time_formate";
    }
    const timeString = data.split(":");
    const hour = parseInt(timeString[0]);
    const minutes = parseFloat((parseInt(timeString[1]) / 60).toFixed(2));
    const timeNumber = hour + minutes;
    return timeNumber;
  }

  countTime(timeFrom: string, timeTo: string) {
    const timeStart = this.timeToNumber(timeFrom);
    const timeEnd = this.timeToNumber(timeTo);
    if (
      timeStart === "wrong_time_formate" ||
      timeEnd === "wrong_time_formate"
    ) {
      return "wrong_time_formate";
    }
    return timeEnd - timeStart;
  }

  private setReservationPlayer(allPlayers: Player[], playerId: string) {
    const player = allPlayers.find((pl) => pl.id === playerId);
    if (!player) {
      return undefined;
    }
    const reservationPlayer: ReservationPlayerDTO = {
      id: player.id,
      name: player.name,
      surname: player.surname,
      telephone: player.telephone,
    };
    return reservationPlayer;
  }

  private checkIsEditable(date: string, role: string) {
    if (role === "admin") {
      return true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }

  parseTimetableToReservationModel(
    timetable: Timetable[],
    allPlayers: Player[],
    role: string
  ) {
    const reservationsArr: OutputReservationDTO[] = [];
    for (const el of timetable) {
      const reservation: OutputReservationDTO = {
        id: el.id,
        form: {
          court: el.court,
          date: el.date,
          guestOne: el.guest_one,
          guestTwo: el.guest_two,
          playerOne: this.setReservationPlayer(allPlayers, el.player_one),
          playerTwo: this.setReservationPlayer(allPlayers, el.player_two),
          timeFrom: el.time_from,
          timeTo: el.time_to,
        },
        isEditable: this.checkIsEditable(el.date, role),
        isFirstPayment: el.is_first_payment,
        isPlayerOnePayed: el.is_player_one_payed,
        isPlayerTwoPayed: el.is_player_two_payed,
        payment: { hourCount: el.hour_count },
        timetable: { layer: el.layer },
      };
      reservationsArr.push(reservation);
    }
    return reservationsArr;
  }
}
