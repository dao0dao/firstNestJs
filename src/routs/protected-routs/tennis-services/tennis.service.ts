import { Injectable } from "@nestjs/common";
import { TennisServiceResolver } from "src/models/model/tennis-service/tennis.resolver.service";
import { ServiceDTO, ServicePaymentDTO } from "./tennis.service.dto";
import { PlayerAccountSQL } from "src/models/model/player-account/player-account.service";
import { PlayerHistorySQL } from "src/models/model/player-history/player-history.service";
import { todaySQLDate } from "src/utils/time";
import { RequestDTO } from "src/request.dto";

@Injectable()
export class TennisService {
  constructor(
    private serviceModel: TennisServiceResolver,
    private playerAccount: PlayerAccountSQL,
    private playerHistory: PlayerHistorySQL
  ) {}
  async getAllServices() {
    const services = [];
    const data = await this.serviceModel.getAllServices();
    data.forEach((s) => {
      services.push({ id: s.id, name: s.name, price: parseFloat(s.price) });
    });
    return { services };
  }

  async updateAllServices(list: ServiceDTO[]) {
    const result = await this.serviceModel.createServices(list);
    return result;
  }

  deleteServiceById(id: number) {
    return this.serviceModel.deleteServiceById(id);
  }

  async handleService(
    data: ServicePaymentDTO,
    cashier: RequestDTO["ADMIN_NAME"]
  ) {
    const errors = {
      accountChargeFail: false,
      createHistoryFail: false,
      accountSubtractFail: false,
    };
    if ("charge" === data.paymentMethod) {
      const result = await this.playerAccount.addToPlayerWallet(
        data.id,
        data.value
      );
      if (!result) {
        errors.accountChargeFail = true;
        return errors;
      }
      return true;
    } else if (
      "payment" === data.paymentMethod ||
      "transfer" === data.paymentMethod
    ) {
      const history = await this.playerHistory.createPlayerHistory({
        is_paid: true,
        player_id: data.id,
        price: data.value.toString(),
        service_name: data.serviceName,
        timetable_id: null,
        service_date: todaySQLDate(),
        payment_method: data.paymentMethod,
        cashier,
      });
      if (!history) {
        errors.createHistoryFail = true;
        return errors;
      }
      if ("payment" === data.paymentMethod) {
        const result = await this.playerAccount.subtractToPlayerWallet(
          data.id,
          data.value
        );
        if (!result) {
          errors.accountSubtractFail = true;
          return errors;
        }
      }
    } else if ("debet" === data.paymentMethod) {
      const history = await this.playerHistory.createPlayerHistory({
        is_paid: false,
        player_id: data.id,
        price: data.value.toString(),
        service_name: data.serviceName,
        timetable_id: null,
        service_date: todaySQLDate(),
        cashier,
      });
      if (!history) {
        errors.createHistoryFail = true;
        return errors;
      }
    }
    return true;
  }
}
