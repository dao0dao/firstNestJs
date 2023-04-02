import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TennisServiceModel } from "./tennis.service.model";

@Injectable()
export class TennisServiceResolver {
  getAllServices() {
    return [];
  }
}
