import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "src/guards/roles.decorators";
import { Player } from "src/models/model/player.models";
import { PriceList } from "src/models/model/priceList.model";
import { PlayerService } from "../player/player.service";
import { PriceListDTO, PriceListQueryDTO } from "./price-list.dto";

@Injectable()
@Role("admin")
export class PriceListService {
  constructor(
    @InjectModel(PriceList) private priceListMode: typeof PriceList,
    private playerService: PlayerService
  ) {}

  getAllPriceList() {
    return this.priceListMode.findAll();
  }

  async createPriceList(data: PriceListDTO) {
    const priceList = await this.priceListMode.create({
      name: data.name,
      hours: data.hours,
    });
    return priceList.id;
  }

  async updatePriceList(data: PriceListDTO, query: PriceListQueryDTO) {
    const priceList = await this.priceListMode.findOne({
      where: { id: query.id },
    });
    if (!priceList) {
      throw new HttpException(
        { reason: "Brak takiej listy" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    priceList.set({ name: data.name, hours: data.hours });
    return priceList.save();
  }

  async deletePriceList(query: PriceListQueryDTO) {
    const result = await this.priceListMode.destroy({
      where: { id: query.id },
    });
    this.playerService.clearPlayerPriceListById(query.id);
    return result;
  }
}
