import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { History } from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";

@Injectable()
export class TimetableHandlePlayerHistoryService {
  constructor(private playerHistory: PlayerHistoryModelService) {}

  createPlayerHistory(reservation: Timetable) {
    const playerCount = this.countPlayers(reservation);
    if (playerCount === 0) {
      return null;
    }
    // const data: History = {
    //   timetable_id: reservation.id,
    //   service_date: reservation.date,
    //   is_paid: false,
    //   service_name: "Wynajęcie kortu",
    // };
  }

  private countPlayers(reservation: Timetable) {
    let playerCount = 0;
    if (reservation.player_one !== "") {
      playerCount++;
    }
    if (reservation.player_two !== "") {
      playerCount++;
    }
    if (reservation.guest_one !== "") {
      playerCount++;
    }
    if (reservation.guest_two !== "") {
      playerCount++;
    }
    return playerCount;
  }

  // private createDataForPlayer(data: {
  //   player_id: string;
  //   playerCount: number;
  //   player_position: number;
  //   reservation: Timetable;
  //   priceList: PriceList[];
  // }) {}
}
