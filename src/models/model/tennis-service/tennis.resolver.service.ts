import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TennisService } from "./tennis.service.model";
import { ServiceDTO } from "src/routs/protected-routs/tennis-services/tennis.service.dto";

@Injectable()
export class TennisServiceResolver {
  constructor(
    @InjectModel(TennisService)
    private serviceModel: typeof TennisService
  ) {}
  getAllServices() {
    return this.serviceModel.findAll();
  }

  createServices(list: ServiceDTO[]) {
    const data: any[] = list;
    return this.serviceModel.bulkCreate(data, {
      fields: ["id", "name", "price"],
      updateOnDuplicate: ["name", "price"],
    });
  }

  deleteServiceById(id: number) {
    return this.serviceModel.destroy({ where: { id } });
  }
}
