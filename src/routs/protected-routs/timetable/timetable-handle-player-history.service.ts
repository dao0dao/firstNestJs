import { Injectable } from "@nestjs/common";
import { PlayerAccountService } from "src/models/model/player-account/player-account.service";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import {
  CreateTimetableHistory,
  PlayerHistory,
  TimetableHistoryPlayers,
} from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { RequestDTO } from "src/request.dto";
import { todaySQLDate } from "src/utils/time";
import { FactoryDataTimetablePlayerHistory } from "./factory data-timetable-player-history";
import { InputReservationPayment, PlayerHistoryPrice } from "./timetable.dto";

@Injectable()
export class TimetableHandlePlayerHistoryService {
  constructor(
    private playerHistory: PlayerHistoryModelService,
    private timetableModel: TimetableSQLService,
    private dataFactory: FactoryDataTimetablePlayerHistory,
    private accountModel: PlayerAccountService
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

  async deletePlayerHistoryByTimetableId(timetable_id: number) {
    const history = await this.playerHistory.getPlayersHistoryByTimetableId(
      timetable_id
    );
    for (const h of history) {
      if (h.payment_method === "payment") {
        await this.accountModel.addToPlayerWallet(
          h.player_id,
          parseFloat(h.price)
        );
      }
    }
    return this.playerHistory.removeTwoTimetablePlayerHistory(timetable_id);
  }

  async payForPlayerHistoryTimetable(
    req: RequestDTO,
    data: InputReservationPayment
  ) {
    const result = {
      updated: false,
      access_denied: false,
      wrong_value: false,
      no_wallet: false,
    };
    const history = await this.playerHistory.getPlayersHistoryByTimetableId(
      data.reservationId
    );
    if (0 === history.length) {
      await this.timetableModel.setReservationPayedForBothPlayers(
        data.reservationId
      );
      result.updated = true;
      return result;
    }
    if (!this.dataFactory.checkCanPayForReservation(req.ROLE, history)) {
      result.access_denied = true;
      return result;
    }
    if (!this.dataFactory.checkCanChangePrice(req.ROLE, data, history)) {
      result.wrong_value = true;
      return result;
    }
    const { reservationId, playerOne, playerTwo } = data;
    if (!playerOne?.id && playerOne?.name) {
      await this.timetableModel.setReservationPayedForPlayerOne(reservationId);
    }
    if (playerOne?.id && playerOne.name && "none" !== playerOne.method) {
      if ("payment" === playerOne.method) {
        const wallet = await this.accountModel.subtractToPlayerWallet(
          playerOne.id,
          playerOne.value
        );
        if (!wallet) {
          result.no_wallet = true;
        }
      }
      await this.playerHistory.payForPlayerHistoryByTimetableIdAnPosition(
        reservationId,
        1,
        playerOne.value,
        playerOne.method,
        req.ADMIN_NAME,
        todaySQLDate()
      );
      await this.timetableModel.setReservationPayedForPlayerOne(reservationId);
    }
    if (!playerTwo?.id && playerTwo?.name) {
      await this.timetableModel.setReservationPayedForPlayerTwo(reservationId);
    }
    if (playerTwo?.id && playerTwo.name && "none" !== data.playerTwo.method) {
      if ("payment" === playerTwo.method) {
        const wallet = await this.accountModel.subtractToPlayerWallet(
          playerTwo.id,
          playerTwo.value
        );
        if (!wallet) {
          result.no_wallet = true;
        }
      }
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
    result.updated = true;
    return result;
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
