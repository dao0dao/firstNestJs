import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player/player.models";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { OutputReservationDTO, ReservationPlayerDTO } from "./timetable.dto";
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
  private setReservationPlayer(allPlayers: Player[], playerId: string) {
    const player = allPlayers.find((pl) => pl.id === playerId);
    if (!player) {
      return undefined;
    }
    const reservationPlayer: ReservationPlayerDTO = {
      id: player.id,
      name: player.name,
      surname: player.surname,
      telephone: player.telephone,
    };
    return reservationPlayer;
  }

  checkCanCreateOrUpdate(date: string, role: string) {
    if (role === "admin") {
      return true;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) >= today;
  }

  async parseTimetableToReservationModelArray(
    timetable: Timetable[],
    role: string
  ) {
    const allPlayers = await this.playerService.findAllPlayers();
    const reservationsArr: OutputReservationDTO[] = [];
    for (const el of timetable) {
      const reservation: OutputReservationDTO =
        this.parseTimetableToReservation(el, allPlayers, role);
      reservationsArr.push(reservation);
    }
    return reservationsArr;
  }

  parseTimetableToReservation(
    timetable: Timetable,
    allPlayers: Player[],
    role: string
  ) {
    const reservation: OutputReservationDTO = {
      id: timetable.id,
      form: {
        court: timetable.court,
        date: timetable.date,
        guestOne: timetable.guest_one,
        guestTwo: timetable.guest_two,
        playerOne: this.setReservationPlayer(allPlayers, timetable.player_one),
        playerTwo: this.setReservationPlayer(allPlayers, timetable.player_two),
        timeFrom: timetable.time_from,
        timeTo: timetable.time_to,
      },
      isEditable: this.checkCanCreateOrUpdate(timetable.date, role),
      isFirstPayment: timetable.is_first_payment,
      isPlayerOnePayed: timetable.is_player_one_payed,
      isPlayerTwoPayed: timetable.is_player_two_payed,
      payment: { hourCount: parseFloat(timetable.hour_count) },
      timetable: { layer: timetable.layer },
    };
    return reservation;
  }

  async createPlayerHistoryForTimetable(reservation: Timetable) {
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
