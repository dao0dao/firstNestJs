import { Injectable } from "@nestjs/common";
import { TennisServiceResolver } from "src/models/model/tennis-service/tennis.resolver.service";
import { ServiceDTO } from "./tennis.service.dto";

@Injectable()
export class TennisService {
  constructor(private serviceModel: TennisServiceResolver) {}
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
}
