import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import {
  CreateTimetableHistory,
  UpdateHistory,
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
      const data = {
        player_id: players.playerOne.id,
        player_position: 1,
        playerCount: playerCount,
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
        playerCount: playerCount,
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

  async updatePlayerHistory(
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
    const playersHistoryTimetable =
      await this.playerHistory.getAllPlayerHistoryByTimetableId(reservation.id);
    if (playersHistoryTimetable.length === 0) {
      //stwórz nową historię
      return this.createPlayerHistory(reservation, priceList, players);
    }
    const { playerOne, playerTwo } = players;
    if (
      ((playerOne && !playerTwo) || (!playerOne && playerTwo)) &&
      1 === playersHistoryTimetable.length
    ) {
      // edycja pojedynczego wpisu
    }
    if (
      ((playerOne && !playerTwo) || (!playerOne && playerTwo)) &&
      2 === playersHistoryTimetable.length
    ) {
      // edycja jednego wpisu i usunięcie drugiego
      if (!playerTwo) {
        await this.playerHistory.removeOneTimetablePlayerHistory(
          reservation.id,
          2
        );
        const priceList_one = priceList.find(
          (el) => el.id === players.playerOne.priceListId
        );
        const data_one = {
          player_id: players.playerOne.id,
          player_position: 1,
          playerCount: playerCount,
          priceList: priceList_one,
          reservation: reservation,
        };
        const existHistory_one = playersHistoryTimetable.find(
          (el) => 2 === el.player_position
        );
        const history_one: UpdateHistory = Object.assign(
          this.createDataForPlayerHistory(data_one),
          { id: existHistory_one.id }
        );
        return this.playerHistory.updateOnePlayerTimetableHistory(history_one);
      }
      if (!playerOne) {
        await this.playerHistory.removeOneTimetablePlayerHistory(
          reservation.id,
          1
        );
        const priceList_two = priceList.find(
          (el) => el.id === players.playerTwo.priceListId
        );
        const data_two = {
          player_id: players.playerOne.id,
          player_position: 1,
          playerCount: playerCount,
          priceList: priceList_two,
          reservation: reservation,
        };
        const existHistory_two = playersHistoryTimetable.find(
          (el) => 2 === el.player_position
        );
        const history_two: UpdateHistory = Object.assign(
          this.createDataForPlayerHistory(data_two),
          { id: existHistory_two.id }
        );
        return this.playerHistory.updateOnePlayerTimetableHistory(history_two);
      }
    }
    if (playerOne && playerTwo) {
      // edycja dwóch wpisów albo nadpisanie wierszy
      for (const oldHis of playersHistoryTimetable) {
        await oldHis.destroy();
      }
      const priceList_one = priceList.find(
        (el) => el.id === players.playerOne.priceListId
      );
      const priceList_two = priceList.find(
        (el) => el.id === players.playerTwo.priceListId
      );
      const data_one = {
        player_id: players.playerOne.id,
        player_position: 1,
        playerCount: playerCount,
        priceList: priceList_one,
        reservation: reservation,
      };
      const data_two = {
        player_id: players.playerOne.id,
        player_position: 1,
        playerCount: playerCount,
        priceList: priceList_two,
        reservation: reservation,
      };
      const history_one = this.createDataForPlayerHistory(data_one);
      const history_two = this.createDataForPlayerHistory(data_two);
      return this.playerHistory.createTwoPlayerHistoryTimetable(
        history_one,
        history_two
      );
    }
    if (!playerOne && !playerTwo) {
      // usunięcie wpisu lub spisów
      this.playerHistory.removeTwoTimetablePlayerHistory(reservation.id);
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
