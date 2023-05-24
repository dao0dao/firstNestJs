import { Injectable } from "@nestjs/common";
import { PlayerAccountSQL } from "src/models/model/player-account/player-account.service";
import { PlayerHistorySQL } from "src/models/model/player-history/player-history.service";
import {
  CreateTimetableHistory,
  PlayerHistory,
  TimetableHistoryPlayers,
} from "src/models/model/player-history/playerHistory.model";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { TimetableSetterService } from "./timetable-setter.service";
import { PriceListSQL } from "src/models/model/price-list/price-list.service";

@Injectable()
export class TimetablePlayerHistoryFactoryService {
  constructor(
    private playerHistorySQL: PlayerHistorySQL,
    private setterService: TimetableSetterService,
    private accountSQL: PlayerAccountSQL,
    private priceList: PriceListSQL
  ) {}

  async createPlayerHistory(timetable: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    const players = await this.setterService.setPlayersForPlayerHistory(
      timetable
    );
    if (3 === timetable.court) {
      return true;
    }
    const playerNumber = this.setterService.setPlayersCount(timetable);
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
        reservation: timetable,
      };
      const history: CreateTimetableHistory =
        this.setterService.setDataForPlayerHistory(data);
      const result = await this.playerHistorySQL.createPlayerHistory(history);
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
        reservation: timetable,
      };
      const history: CreateTimetableHistory =
        this.setterService.setDataForPlayerHistory(data);
      const result = await this.playerHistorySQL.createPlayerHistory(history);
      if (!result) {
        return { playerTwo: false };
      }
    }
    return true;
  }

  async updatePlayerHistoryTimetable(timetable: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    const players = await this.setterService.setPlayersForPlayerHistory(
      timetable
    );
    const history = await this.playerHistorySQL.getPlayersHistoryByTimetableId(
      timetable.id
    );
    if (3 === timetable.court) {
      await this.playerHistorySQL.removeTwoTimetablePlayerHistory(timetable.id);
      return true;
    }
    const playerNumber = this.setterService.setPlayersCount(timetable);
    if (playerNumber === 0) {
      return false;
    }
    if (0 === history.length) {
      //stwórz nową historię jeśli jej brak
      return this.createPlayerHistory(timetable);
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
      if (timetable.player_one === h.player_id) {
        player_position = 1;
        playerPriceList = priceList.find(
          (el) => el.id === playerOne.priceListId
        );
      }
      if (timetable.player_two === h.player_id) {
        player_position = 2;
        playerPriceList = priceList.find(
          (el) => el.id === playerTwo.priceListId
        );
      }
      const data = this.setterService.setDataForPlayerHistory({
        player_id: h.player_id,
        player_position,
        playerCount: playerNumber,
        priceList: playerPriceList,
        reservation: timetable,
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
      return this.createPlayerHistory(timetable);
    }
  }

  async deletePlayerHistoryByTimetableId(timetable_id: number) {
    const history = await this.playerHistorySQL.getPlayersHistoryByTimetableId(
      timetable_id
    );
    for (const h of history) {
      if (h.payment_method === "payment") {
        await this.accountSQL.addToPlayerWallet(
          h.player_id,
          parseFloat(h.price)
        );
      }
    }
    return this.playerHistorySQL.removeTwoTimetablePlayerHistory(timetable_id);
  }
}
