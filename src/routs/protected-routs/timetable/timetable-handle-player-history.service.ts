import { Injectable } from "@nestjs/common";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import {
  CreateTimetableHistory,
  PlayerHistory,
  TimetableHistoryPlayers,
} from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableService } from "src/models/model/timetable/timetable.service";
import { RequestDTO } from "src/request.dto";
import { todaySQLDate } from "src/utils/time";
import { FactoryDataTimetablePlayerHistory } from "./factory data-timetable-player-history";
import { InputReservationPayment, PlayerHistoryPrice } from "./timetable.dto";

@Injectable()
export class TimetableHandlePlayerHistoryService {
  constructor(
    private playerHistory: PlayerHistoryModelService,
    private timetableModel: TimetableService,
    private dataFactory: FactoryDataTimetablePlayerHistory
  ) {}

  async createPlayerHistory(
    reservation: Timetable,
    priceList: PriceList[],
    players: TimetableHistoryPlayers
  ) {
    if (3 === reservation.court) {
      return true;
    }
    const playerNumber = this.dataFactory.countPlayers(reservation);
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
        this.dataFactory.createDataForPlayerHistory(data);
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
        this.dataFactory.createDataForPlayerHistory(data);
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
    const history = await this.playerHistory.getPlayersHistoryByTimetableId(
      reservation.id
    );
    if (3 === reservation.court) {
      await this.playerHistory.removeTwoTimetablePlayerHistory(reservation.id);
      return true;
    }
    const playerNumber = this.dataFactory.countPlayers(reservation);
    if (playerNumber === 0) {
      return false;
    }
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
        new_Players.playerTwo = playerTwo;
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
      const data = this.dataFactory.createDataForPlayerHistory({
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

  deletePlayerHistoryByTimetableId(timetable_id: number) {
    return this.playerHistory.removeTwoTimetablePlayerHistory(timetable_id);
  }

  async payForPlayerHistoryTimetable(
    req: RequestDTO,
    data: InputReservationPayment
  ) {
    const history = await this.playerHistory.getPlayersHistoryByTimetableId(
      data.reservationId
    );
    if (0 === history.length) {
      await this.timetableModel.setReservationPayedForBothPlayers(
        data.reservationId
      );
      return { updated: true };
    }
    if (!this.dataFactory.checkCanPayForReservation(req.ROLE, history)) {
      return { access_denied: true };
    }
    if (!this.dataFactory.checkCanChangePrice(req.ROLE, data, history)) {
      return { wrong_value: true };
    }
    const { reservationId, playerOne, playerTwo } = data;
    if (!playerOne?.id && playerOne?.name) {
      await this.timetableModel.setReservationPayedForPlayerOne(reservationId);
    }
    if (playerOne?.id && playerOne.name && "none" !== data.playerOne.method) {
      await this.playerHistory.payForPlayerHistoryByTimetableIdAnPosition(
        reservationId,
        1,
        playerOne.value,
        data.playerOne.method,
        req.ADMIN_NAME,
        todaySQLDate()
      );
      await this.timetableModel.setReservationPayedForPlayerOne(reservationId);
    }
    if (!playerTwo?.id && playerTwo.name) {
      await this.timetableModel.setReservationPayedForPlayerTwo(reservationId);
    }
    if (playerTwo?.id && playerTwo.name && "none" !== data.playerTwo.method) {
      await this.playerHistory.payForPlayerHistoryByTimetableIdAnPosition(
        reservationId,
        2,
        playerTwo.value,
        data.playerTwo.method,
        req.ADMIN_NAME,
        todaySQLDate()
      );
      await this.timetableModel.setReservationPayedForPlayerTwo(reservationId);
    }
    return { updated: true };
  }

  async getReservationPrice(reservation_id: number) {
    const data: PlayerHistoryPrice[] = [];
    const history =
      await this.playerHistory.getPriceFromPlayerHistoryByTimetableId(
        reservation_id
      );
    for (const h of history) {
      data.push({
        is_paid: h.is_paid,
        player: h.player,
        player_position: parseInt(h.player_position),
        price: parseFloat(h.price),
      });
    }
    return data;
  }
}
