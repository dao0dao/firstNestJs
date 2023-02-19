import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import {
  CreateTimetableHistory,
  PlayerHistory,
  TimetableHistoryPlayers,
} from "src/models/model/player-history/playerHistory.model";
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
    players: TimetableHistoryPlayers
  ) {
    if (3 === reservation.court) {
      return true;
    }
    const playerNumber = this.countPlayers(reservation);
    if (playerNumber === 0) {
      return false;
    }
    if (priceList.length === 0) {
      return null;
    }
    if (players.playerOne) {
      const playerPriceList = priceList.find(
        (el) => el.id === players.playerOne.priceListId
      );
      const data = {
        player_id: players.playerOne.id,
        player_position: 1,
        playerCount: playerNumber,
        priceList: playerPriceList,
        reservation: reservation,
      };
      const history: CreateTimetableHistory =
        this.createDataForPlayerHistory(data);
      const result = await this.playerHistory.createPlayerHistory(history);
      if (!result) {
        return { playerOne: false };
      }
    }
    if (players.playerTwo) {
      const playerPriceList = priceList.find(
        (el) => el.id === players.playerTwo.priceListId
      );
      const data = {
        player_id: players.playerTwo.id,
        player_position: 2,
        playerCount: playerNumber,
        priceList: playerPriceList,
        reservation: reservation,
      };
      const history: CreateTimetableHistory =
        this.createDataForPlayerHistory(data);
      const result = await this.playerHistory.createPlayerHistory(history);
      if (!result) {
        return { playerTwo: false };
      }
    }
    return true;
  }

  async updatePlayerHistoryTimetable(
    reservation: Timetable,
    priceList: PriceList[],
    players: TimetableHistoryPlayers
  ) {
    if (3 === reservation.court) {
      //jeśli lista rezerwowych usuń historię
      await this.playerHistory.removeTwoTimetablePlayerHistory(reservation.id);
      return true;
    }
    const playerNumber = this.countPlayers(reservation);
    if (playerNumber === 0) {
      return false;
    }
    const history = await this.playerHistory.getPlayersHistoryByTimetableId(
      reservation.id
    );
    if (0 === history.length) {
      //stwórz nową historię jeśli jej brak
      return this.createPlayerHistory(reservation, priceList, players);
    }
    const history_to_update: PlayerHistory[] = [];
    const { playerOne, playerTwo } = players;
    const new_Players: TimetableHistoryPlayers = {};
    for (const h of history) {
      if (playerOne && h.player_id === playerOne.id) {
        history_to_update.push(h);
      }
      if (playerTwo && h.player_id === playerTwo.id) {
        history_to_update.push(h);
      }
    }
    if (playerOne) {
      const player_history = history.find(
        (el) => playerOne.id === el.player_id
      );
      if (!player_history) {
        new_Players.playerOne = playerOne;
      }
    }
    if (playerTwo) {
      const player_history = history.find(
        (el) => playerTwo.id === el.player_id
      );
      if (!player_history) {
        new_Players.playerTwo = playerOne;
      }
    }
    const history_to_delete: PlayerHistory[] = history.filter(
      (el) => !history_to_update.includes(el)
    );
    for (const el of history_to_delete) {
      //usuń nieaktualne wpis gracza
      await el.destroy();
    }
    for (const h of history_to_update) {
      //odśwież aktualne wpisy
      let player_position = 1;
      let playerPriceList: PriceList;
      if (reservation.player_one === h.player_id) {
        player_position = 1;
        playerPriceList = priceList.find(
          (el) => el.id === playerOne.priceListId
        );
      }
      if (reservation.player_two === h.player_id) {
        player_position = 2;
        playerPriceList = priceList.find(
          (el) => el.id === playerTwo.priceListId
        );
      }
      const data = this.createDataForPlayerHistory({
        player_id: h.player_id,
        player_position,
        playerCount: playerNumber,
        priceList: playerPriceList,
        reservation,
      });
      h.set({
        player_position: data.player_position,
        service_date: data.service_date,
        price: data.price,
      });
      await h.save();
    }
    if (Object.keys(new_Players).length) {
      //jeśli jest nowy wpis- stwórz
      return this.createPlayerHistory(reservation, priceList, new_Players);
    }
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

  private createDataForPlayerHistory(data: {
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

    const history: CreateTimetableHistory = {
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
      const price =
        (parseFloat(data.priceList.default_Price) * data.hourCount) /
        data.playerCount;
      return price;
    }
    const day = new Date(data.date).getDay();
    const hoursArr: HoursDTO[] = [];
    let leftHours: number = data.hourCount;
    for (const key in data.priceList.hours) {
      const el = data.priceList.hours[key];
      if (el.days.includes(day)) {
        hoursArr.push(el);
      }
    }
    if (hoursArr.length > 0) {
      let price = 0;
      const playFrom = timeToNumber(data.time_from);
      const playTimeTo = timeToNumber(data.time_to);
      if (
        playFrom === "wrong_time_formate" ||
        playTimeTo === "wrong_time_formate"
      ) {
        const price =
          (parseFloat(data.priceList.default_Price) * data.hourCount) /
          data.playerCount;
        return price;
      }
      const playTo = playTimeTo === 0 ? 24 : playTimeTo;
      for (const hour of hoursArr) {
        const hourFrom = timeToNumber(hour.from);
        const hourTimeTo = timeToNumber(hour.to);
        if (
          hourFrom === "wrong_time_formate" ||
          hourTimeTo === "wrong_time_formate"
        ) {
          const price =
            (parseFloat(data.priceList.default_Price) * data.hourCount) /
            data.playerCount;
          return price;
        }
        const hourTo = hourTimeTo === 0 ? 24 : hourTimeTo;
        if (
          (playFrom < hourFrom && playTo < hourTo && playTo > hourFrom) ||
          (playFrom > hourFrom && playFrom < hourTo && playTo > hourTo) ||
          (playFrom >= hourFrom &&
            playFrom < hourTo &&
            playTo <= hourTo &&
            playTo > hourFrom) ||
          (playFrom < hourFrom && playTo > hourTo) ||
          (playFrom >= hourFrom && playFrom < hourTo && playTo > hourTo) ||
          (playFrom < hourFrom && playTo <= hourTo && playTo > hourFrom)
        ) {
          const startTime = playFrom >= hourFrom ? playFrom : hourFrom;
          const endTime = playTo <= hourTo ? playTo : hourTo;
          price += (endTime - startTime) * hour.price;
          leftHours -= endTime - startTime;
        }
      }
      if (leftHours > 0) {
        price += leftHours * parseFloat(data.priceList.default_Price);
      }
      return price / data.playerCount;
    }
    const price =
      (parseFloat(data.priceList.default_Price) * data.hourCount) /
      data.playerCount;
    return price;
  }
}
