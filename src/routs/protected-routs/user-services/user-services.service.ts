import { Injectable } from "@nestjs/common";
import { UserServicesSQL } from "src/models/model/user-servicec/user-services.service";
import { ServiceDTO, ServicePaymentDTO } from "./tennis.service.dto";
import { PlayerAccountSQL } from "src/models/model/player-account/player-account.service";
import { PlayerHistorySQL } from "src/models/model/player-history/player-history.service";
import { todaySQLDate } from "src/utils/time";
import { RequestDTO } from "src/request.dto";

@Injectable()
export class UserServicesService {
  constructor(
    private userServicesSQL: UserServicesSQL,
    private playerAccountSQL: PlayerAccountSQL,
    private playerHistorySQL: PlayerHistorySQL
  ) {}
  async getUserServices() {
    const services = [];
    const data = await this.userServicesSQL.getAllServices();
    data.forEach((s) => {
      services.push({ id: s.id, name: s.name, price: parseFloat(s.price) });
    });
    return { services };
  }

  async updateUserServices(list: ServiceDTO[]) {
    const result = await this.userServicesSQL.createServices(list);
    return result;
  }

  deleteUserServiceById(id: number) {
    return this.userServicesSQL.deleteServiceById(id);
  }

  async payForService(
    data: ServicePaymentDTO,
    cashier: RequestDTO["ADMIN_NAME"]
  ) {
    if ("charge" === data.paymentMethod) {
      const result = await this.playerAccountSQL.addToPlayerWallet(
        data.id,
        data.value
      );
      if (!result) {
        return "accountChargeFail";
      }
      return true;
    } else if (
      "payment" === data.paymentMethod ||
      "transfer" === data.paymentMethod
    ) {
      const history = await this.playerHistorySQL.createPlayerHistory({
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
        return "createHistoryFail";
      }
      if ("payment" === data.paymentMethod) {
        const result = await this.playerAccountSQL.subtractToPlayerWallet(
          data.id,
          data.value
        );
        if (!result) {
          return "accountSubtractFail";
        }
      }
    } else if ("debet" === data.paymentMethod) {
      const history = await this.playerHistorySQL.createPlayerHistory({
        is_paid: false,
        player_id: data.id,
        price: data.value.toString(),
        service_name: data.serviceName,
        timetable_id: null,
        service_date: todaySQLDate(),
        cashier,
      });
      if (!history) {
        return "createHistoryFail";
      }
    }
    return true;
  }
}
