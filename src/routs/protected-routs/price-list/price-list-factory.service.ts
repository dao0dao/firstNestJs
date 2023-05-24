import { Injectable } from "@nestjs/common";
import { PriceListValidationService } from "./price-list-validation.service";
import { PriceListSQL } from "src/models/model/price-list/price-list.service";
import { PriceListDTO, PriceListQueryDTO } from "./price-list.dto";
import { PriceList } from "src/models/model/price-list/priceList.model";

@Injectable()
export class PriceListFactoryService {
  constructor(
    private priceListSQL: PriceListSQL,
    private priceListValidation: PriceListValidationService
  ) {}
  async getPriceLists() {
    const priceListModel = await this.priceListSQL.getAllPriceList();
    const priceList = this.parsePriceListModelToDTO(priceListModel);
    return { priceList };
  }

  async createPriceList(body: PriceListDTO) {
    const isWrongData = this.priceListValidation.validateHoursAndDay(body);
    const id = await this.priceListSQL.createPriceList(body);
    if (isWrongData) {
      return "wrong_data";
    }
    return { status: "created", id };
  }

  async updatePriceList(body: PriceListDTO, query: PriceListQueryDTO) {
    const isWrongData = this.priceListValidation.validateHoursAndDay(body);
    if (isWrongData) {
      return "wrong_data";
    }
    const result = await this.priceListSQL.updatePriceList(body, query);
    if ("no_list" === result) {
      return result;
    }
    return { status: "updated" };
  }

  async deletePriceList(query: PriceListQueryDTO) {
    await this.priceListSQL.deletePriceList(query);
    return { status: "deleted" };
  }

  private parsePriceListModelToDTO(list: PriceList[]) {
    const priceList: PriceListDTO[] = [];
    for (const el of list) {
      priceList.push({
        id: el.id,
        defaultPrice: parseFloat(el.default_Price),
        name: el.name,
        hours: el.hours,
      });
    }
    return priceList;
  }
}
