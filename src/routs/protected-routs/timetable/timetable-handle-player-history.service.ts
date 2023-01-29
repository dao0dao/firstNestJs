import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { History } from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { timeToNumber } from "src/utils/time";
import { HoursDTO } from "../price-list/price-list.dto";

@Injectable()
export class TimetableHandlePlayerHistoryService {
  constructor(private playerHistory: PlayerHistoryModelService) {}

  async createPlayerHistory(
    reservation: Timetable,
    priceList: PriceList[],
    players: {
      playerOne?: {
        id: string;
        priceListId: string;
      };
      playerTwo?: {
        id: string;
        priceListId: string;
      };
    }
  ) {
    const playerCount = this.countPlayers(reservation);
    if (playerCount === 0) {
      return false;
    }
    if (priceList.length === 0) {
      return null;
    }
    if (players.playerOne) {
      const playerPriceList = priceList.find(
        (el) => el.id === players.playerOne.priceListId
      );
      const history: History = this.createDataForPlayer({
        player_id: players.playerOne.id,
        player_position: 1,
        playerCount: playerCount,
        priceList: playerPriceList,
        reservation: reservation,
      });
      const result = await this.playerHistory.createPlayerHistory(history);
      if (!result) {
        return { playerOne: false };
      }
    }
    if (players.playerTwo) {
      const playerPriceList = priceList.find(
        (el) => el.id === players.playerTwo.priceListId
      );
      const history: History = this.createDataForPlayer({
        player_id: players.playerTwo.id,
        player_position: 2,
        playerCount: playerCount,
        priceList: playerPriceList,
        reservation: reservation,
      });
      const result = await this.playerHistory.createPlayerHistory(history);
      if (!result) {
        return { playerTwo: false };
      }
    }
    return true;
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

  private createDataForPlayer(data: {
    player_id: string;
    playerCount: number;
    player_position: number;
    reservation: Timetable;
    priceList: PriceList;
  }) {
    const price = this.setPlayerPrice({
      date: data.reservation.date,
      hourCount: parseFloat(data.reservation.hour_count),
      playerCount: data.playerCount,
      priceList: data.priceList,
      time_from: data.reservation.time_from,
      time_to: data.reservation.time_to,
    });

    const history: History = {
      player_id: data.player_id,
      price: price.toFixed(2),
      is_paid: false,
      service_date: data.reservation.date,
      service_name: "Wynajęcie kortu",
      timetable_id: data.reservation.id,
      player_position: data.player_position,
    };
    return history;
  }

  private setPlayerPrice(data: {
    date: string;
    time_from: string;
    time_to: string;
    priceList: PriceList;
    playerCount: number;
    hourCount: number;
  }) {
    if (!data.priceList) {
      return 0;
    }
    if (Object.keys(data.priceList.hours).length === 0) {
      return 0;
    }
    const day = new Date(data.date).getDay();
    const hoursArr: HoursDTO[] = [];
    for (const key in data.priceList.hours) {
      const el = data.priceList.hours[key];
      if (el.days.includes(day)) {
        hoursArr.push(el);
      }
    }
    if (hoursArr.length > 0) {
      let price = 0;
      const playForm = timeToNumber(data.time_from);
      const playTo = timeToNumber(data.time_to);
      if (
        playForm === "wrong_time_formate" ||
        playTo === "wrong_time_formate"
      ) {
        const price =
          (parseFloat(data.priceList.default_Price) * data.hourCount) /
          data.playerCount;
        return price;
      }
      for (const hour of hoursArr) {
        const hourFrom = timeToNumber(hour.from);
        const hourTo = timeToNumber(hour.to);
        if (
          hourFrom === "wrong_time_formate" ||
          hourTo === "wrong_time_formate"
        ) {
          const price =
            (parseFloat(data.priceList.default_Price) * data.hourCount) /
            data.playerCount;
          return price;
        }
        if (playForm >= hourFrom || (playTo <= hourTo && playTo > hourFrom)) {
          const endTime = playTo <= hourTo ? playTo : hourTo;
          price += (endTime - playForm) * hour.price;
        }
      }
      return price / data.playerCount;
    }
    const price =
      (parseFloat(data.priceList.default_Price) * data.hourCount) /
      data.playerCount;
    return price;
  }
}
