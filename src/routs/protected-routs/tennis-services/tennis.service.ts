import { Injectable } from "@nestjs/common";
import { TennisServiceResolver } from "src/models/model/tennis-service/tennis.resolver.service";

@Injectable()
export class TennisService {
  constructor(private serviceModel: TennisServiceResolver) {}
  getAllServices() {
    return this.serviceModel.getAllServices();
  }
}
