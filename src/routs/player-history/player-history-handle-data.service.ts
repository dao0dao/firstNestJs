import { Injectable } from "@nestjs/common";
import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";
import { HistoryOutputDTO, PlayerHistoryOutputDTO } from "./player-history.dto";

@Injectable()
export class PlayerHistoryHandleDataService {
  parsePlayerHistoryToDTO(data: PlayerHistory[]) {
    let totalPrice = 0;
    const history: HistoryOutputDTO[] = [];
    for (const el of data) {
      if (!el.is_paid) {
        totalPrice += el.price;
      }
      history.push({
        cashier: el.cashier,
        id: el.id,
        isPaid: el.is_paid,
        paymentDate: el.payment_date,
        paymentMethod: el.payment_method,
        price: el.price,
        serviceDate: el.service_date,
        serviceName: el.service_name,
      });
    }
    return {
      history,
      totalPrice,
    };
  }
}
