import { Injectable } from "@nestjs/common";
import { PriceList } from "src/models/model/price-list/priceList.model";
import { PriceListDTO } from "./price-list.dto";

@Injectable()
export class PriceListHandleDataService {
  parsePriceListModelToDTO(list: PriceList[]) {
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
