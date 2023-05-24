import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import {
  PriceListDTO,
  PriceListQueryDTO,
} from "src/routs/protected-routs/price-list/price-list.dto";
import { PlayerSQL } from "../player/player.service";
import { PriceList } from "./priceList.model";

@Injectable()
export class PriceListSQL {
  constructor(
    @InjectModel(PriceList) private priceListModel: typeof PriceList,
    private playerSQL: PlayerSQL
  ) {}

  getAllPriceList() {
    return this.priceListModel.findAll();
  }

  async createPriceList(data: PriceListDTO) {
    const priceList = await this.priceListModel.create({
      name: data.name,
      hours: data.hours,
      default_Price: data.defaultPrice,
    });
    return priceList.id;
  }

  async updatePriceList(data: PriceListDTO, query: PriceListQueryDTO) {
    const priceList = await this.priceListModel.findOne({
      where: { id: query.id },
    });
    if (!priceList) {
      return "no_list";
    }
    priceList.set({
      name: data.name,
      hours: data.hours,
      default_Price: data.defaultPrice,
    });
    return priceList.save();
  }

  async deletePriceList(query: PriceListQueryDTO) {
    const result = await this.priceListModel.destroy({
      where: { id: query.id },
    });
    this.playerSQL.clearPlayerPriceListById(query.id);
    return result;
  }
}
