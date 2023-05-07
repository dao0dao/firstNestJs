import { InputReservationPayment, PlayerHistoryPrice } from "./timetable.dto";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { RequestDTO } from "src/request.dto";
import { todaySQLDate } from "src/utils/time";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { TimetableCheckersService } from "./timetable-checker.service";
import { PlayerAccountService } from "src/models/model/player-account/player-account.service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TimetablePaymentFactoryService {
  constructor(
    private playerHistory: PlayerHistoryModelService,
    private timetableSQL: TimetableSQLService,
    private checkerService: TimetableCheckersService,
    private accountSQL: PlayerAccountService
  ) {}

  async payForReservation(req: RequestDTO, data: InputReservationPayment) {
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
      await this.timetableSQL.setReservationPayedForBothPlayers(
        data.reservationId
      );
      result.updated = true;
      return result;
    }
    if (!this.checkerService.checkCanPayForReservation(req.ROLE, history)) {
      result.access_denied = true;
      return result;
    }
    if (!this.checkerService.checkCanChangePrice(req.ROLE, data, history)) {
      result.wrong_value = true;
      return result;
    }
    const { reservationId, playerOne, playerTwo } = data;
    if (!playerOne?.id && playerOne?.name) {
      await this.timetableSQL.setReservationPayedForPlayerOne(reservationId);
    }
    if (playerOne?.id && playerOne.name && "none" !== playerOne.method) {
      if ("payment" === playerOne.method) {
        const wallet = await this.accountSQL.subtractToPlayerWallet(
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
      await this.timetableSQL.setReservationPayedForPlayerOne(reservationId);
    }
    if (!playerTwo?.id && playerTwo?.name) {
      await this.timetableSQL.setReservationPayedForPlayerTwo(reservationId);
    }
    if (playerTwo?.id && playerTwo.name && "none" !== data.playerTwo.method) {
      if ("payment" === playerTwo.method) {
        const wallet = await this.accountSQL.subtractToPlayerWallet(
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
      await this.timetableSQL.setReservationPayedForPlayerTwo(reservationId);
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
