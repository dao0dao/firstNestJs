import { Injectable } from "@nestjs/common";
import { PlayerAccountService } from "src/models/model/player-account/player-account.service";
import { PlayerAccount } from "src/models/model/player-account/playerAccount.model";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";
import { TimetableSQLService } from "src/models/model/timetable/timetable-sql.service";
import { RequestDTO } from "src/request.dto";
import { checkCanAcceptPayment } from "./factory-player-history.service";
import { HistoryOutputDTO, InputPayForHistory } from "./player-history.dto";

@Injectable()
export class PlayerHistoryHandleDataService {
  constructor(
    private historyModel: PlayerHistoryModelService,
    private timetableModel: TimetableSQLService,
    private accountModel: PlayerAccountService
  ) {}
  parsePlayerHistoryToDTO(data: PlayerHistory[], playerBlance: PlayerAccount) {
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

  async payForHistory(
    data: InputPayForHistory,
    cashier: string,
    role: RequestDTO["ROLE"]
  ) {
    const errors = { no_history: false, access_denied: false };
    const history = await this.historyModel.getPlayerHistoryById(data.id);
    if (!history) {
      errors.no_history = true;
      return errors;
    }
    const canPay = checkCanAcceptPayment(role, data, history);
    if (!canPay) {
      errors.access_denied = true;
      return errors;
    }
    if (history.timetable_id) {
      if ("1" === history.player_position) {
        await this.timetableModel.setReservationPayedForPlayerOne(
          history.timetable_id
        );
      }
      if ("2" === history.player_position) {
        await this.timetableModel.setReservationPayedForPlayerTwo(
          history.timetable_id
        );
      }
    }
    if (data.payment_method === "payment") {
      await this.accountModel.subtractToPlayerWallet(
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
