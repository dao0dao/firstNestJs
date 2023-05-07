import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player/player.models";
import { Timetable } from "src/models/model/timetable/timetable.model";
import { ReservationPlayerDTO, OutputReservationDTO } from "./timetable.dto";
import { PlayerService } from "src/models/model/player/player.service";
import { SettersAndCheckersFactory } from "./setters-and-checkers-factory.service";

@Injectable()
export class TimetableParserService {
  constructor(
    private playerService: PlayerService,
    private settersCheckers: SettersAndCheckersFactory
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
      isEditable: this.settersCheckers.checkCanCreateOrUpdate(
        timetable.date,
        role
      ),
      isFirstPayment: timetable.is_first_payment,
      isPlayerOnePayed: timetable.is_player_one_payed,
      isPlayerTwoPayed: timetable.is_player_two_payed,
      payment: { hourCount: parseFloat(timetable.hour_count) },
      timetable: { layer: timetable.layer },
    };
    return reservation;
  }
}
