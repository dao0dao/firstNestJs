import { Injectable } from "@nestjs/common";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { PriceListService } from "src/models/model/price-list/price-list.service";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";
import { PlayerHistoryPrice } from "./timetable.dto";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { TimetableSetterService } from "./timetable-setter.service";

@Injectable()
export class TimetableService {
  constructor(
    private priceList: PriceListService,
    private timetableHistory: TimetableHandlePlayerHistoryService,
    private playerHistory: PlayerHistoryModelService,
    private setterFactory: TimetableSetterService
  ) {}

  async createPlayerHistory(timetable: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    const players = await this.setterFactory.setPlayersForPlayerHistory(
      timetable
    );
    const playersHistory = await this.timetableHistory.createPlayerHistory(
      timetable,
      priceList,
      players
    );
    return playersHistory;
  }

  async updatePlayerHistoryForTimetable(timetable: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    const players = await this.setterFactory.setPlayersForPlayerHistory(
      timetable
    );
    await this.timetableHistory.updatePlayerHistoryTimetable(
      timetable,
      priceList,
      players
    );
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
