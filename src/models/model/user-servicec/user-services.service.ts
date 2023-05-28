import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserServices } from "./user-services.model";
import { ServiceDTO } from "src/routs/protected-routs/user-services/tennis.service.dto";

@Injectable()
export class UserServicesSQL {
  constructor(
    @InjectModel(UserServices)
    private serviceModel: typeof UserServices
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
