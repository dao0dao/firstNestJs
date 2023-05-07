import { Injectable } from "@nestjs/common";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { PlayerService } from "src/models/model/player/player.service";
import { PriceListService } from "src/models/model/price-list/price-list.service";
import { TimetableHandlePlayerHistoryService } from "./timetable-handle-player-history.service";

@Injectable()
export class TimetableService {
  constructor(
    private playerService: PlayerService,
    private priceList: PriceListService,
    private timetableHistory: TimetableHandlePlayerHistoryService
  ) {}

  async createPlayerHistory(reservation: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    let playerOne = undefined;
    let playerTwo = undefined;
    if (reservation.player_one) {
      playerOne = {
        id: reservation.player_one,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          reservation.player_one
        ),
      };
    }
    if (reservation.player_two) {
      playerTwo = {
        id: reservation.player_two,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          reservation.player_two
        ),
      };
    }
    const playersHistory = await this.timetableHistory.createPlayerHistory(
      reservation,
      priceList,
      { playerOne, playerTwo }
    );
    return playersHistory;
  }

  async updatePlayerHistoryForTimetable(timetable: Timetable) {
    const priceList = await this.priceList.getAllPriceList();
    let playerOne = undefined;
    let playerTwo = undefined;
    if (timetable.player_one) {
      playerOne = {
        id: timetable.player_one,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          timetable.player_one
        ),
      };
    }
    if (timetable.player_two) {
      playerTwo = {
        id: timetable.player_two,
        priceListId: await this.playerService.getPlayerPriceListIdByPlayerId(
          timetable.player_two
        ),
      };
    }
    await this.timetableHistory.updatePlayerHistoryTimetable(
      timetable,
      priceList,
      {
        playerOne,
        playerTwo,
      }
    );
  }
}
