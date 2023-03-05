import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import {
  PlayerHistory,
  CreateTimetableHistory,
} from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableService } from "src/models/model/timetable/timetable.service";
import { RequestDTO } from "src/request.dto";
import { timeToNumber } from "src/utils/time";
import { HoursDTO } from "../price-list/price-list.dto";
import { InputReservationPayment } from "./timetable.dto";

@Injectable()
export class FactoryDataTimetablePlayerHistory {
  constructor(
    private historyModel: PlayerHistoryModelService,
    private timetableModel: TimetableService
  ) {}

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

  countPlayers(reservation: Timetable) {
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

  createDataForPlayerHistory(data: {
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

  setPlayerPrice(data: {
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
