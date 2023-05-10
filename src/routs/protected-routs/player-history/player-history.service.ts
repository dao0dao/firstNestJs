import { Injectable } from "@nestjs/common";
import { PlayerAccountSQL } from "src/models/model/player-account/player-account.service";
import { PlayerAccount } from "src/models/model/player-account/playerAccount.model";
import { PlayerHistorySQL } from "src/models/model/player-history/player-history.service";
import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { RequestDTO } from "src/request.dto";
import { checkCanAcceptPayment } from "./payment-checker";
import {
  HistoryOutputDTO,
  InputPayForHistory,
  PlayerHistoryQuery,
} from "./player-history.dto";

@Injectable()
export class PlayerHistoryService {
  constructor(
    private playerHistorySQL: PlayerHistorySQL,
    private timetableSQL: TimetableSQLService,
    private accountSQL: PlayerAccountSQL
  ) {}

  async getPlayerHistoryByDate(query: PlayerHistoryQuery) {
    const { dateFrom, dateTo, playerId } = query;
    const history = await this.playerHistorySQL.getPlayerHistoryByDate(
      playerId,
      dateTo,
      dateFrom
    );
    const playerBalance = await this.accountSQL.getPlayerWalletById(playerId);
    const data = this.parsePlayerHistoryToDTO(history, playerBalance);
    return data;
  }

  async setPlayerHistoryAsPaid(
    name: RequestDTO["ADMIN_NAME"],
    role: RequestDTO["ROLE"],
    data: InputPayForHistory
  ) {
    const result = await this.payForHistory(data, name, role);
    if (result !== true) {
      return result;
    }
    return result;
  }

  async deletePlayerHistory(id: string) {
    const history = await this.playerHistorySQL.getPlayerHistoryById(
      parseInt(id)
    );
    if (!history) {
      return "serverIntervalError";
    }
    if (history.payment_method === "payment") {
      await this.accountSQL.addToPlayerWallet(
        history.player_id,
        parseFloat(history.price)
      );
    }
    return history.destroy();
  }

  private parsePlayerHistoryToDTO(
    data: PlayerHistory[],
    playerBlance: PlayerAccount
  ) {
    let totalPrice = 0;
    const history: HistoryOutputDTO[] = [];
    for (const el of data) {
      if (!el.is_paid) {
        totalPrice += parseFloat(el.price);
      }
      history.push({
        cashier: el.cashier,
        id: el.id,
        isPaid: el.is_paid,
        paymentDate: el.payment_date,
        paymentMethod: el.payment_method,
        price: parseFloat(el.price),
        serviceDate: el.service_date,
        serviceName: el.service_name,
      });
    }
    return {
      history,
      totalPrice,
      balance: playerBlance?.wallet,
    };
  }

  private async payForHistory(
    data: InputPayForHistory,
    cashier: string,
    role: RequestDTO["ROLE"]
  ) {
    const history = await this.playerHistorySQL.getPlayerHistoryById(data.id);
    if (!history) {
      return "serverIntervalError";
    }
    const canPay = checkCanAcceptPayment(role, data, history);
    if (!canPay) {
      return "accessDenied";
    }
    if (history.timetable_id) {
      if ("1" === history.player_position) {
        await this.timetableSQL.setReservationPayedForPlayerOne(
          history.timetable_id
        );
      }
      if ("2" === history.player_position) {
        await this.timetableSQL.setReservationPayedForPlayerTwo(
          history.timetable_id
        );
      }
    }
    if (data.payment_method === "payment") {
      await this.accountSQL.subtractToPlayerWallet(
        history.player_id,
        parseFloat(data.price)
      );
    }
    if (data.price) {
      history.set({
        price: data.price,
      });
    }
    history.set({
      is_paid: true,
      payment_method: data.payment_method,
      cashier,
    });
    await history.save();
    return true;
  }
}
