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

  validateHoursAndDay(list: PriceListDTO) {
    if (this.checkCoveringHours(list)) {
      console.log(1);
      return true;
    }
    if (this.compareFromToHours(list)) {
      return true;
    }
    return false;
  }

  private checkCoveringHours(list: PriceListDTO) {
    let isError = false;
    for (const i in list.hours) {
      const el_A = list.hours[i];
      const fromA = parseFloat(el_A.from.replace(":", "."));
      let toA = parseFloat(el_A.to.replace(":", "."));
      if (toA === 0) {
        toA = 24.0;
      }
      for (const j in list.hours) {
        const el_B = list.hours[j];
        if (i != j) {
          const daysA: number[] = el_A.days;
          const daysB: number[] = el_B.days;
          let isSameDays = false;
          for (const d of daysA) {
            daysB.includes(d) ? (isSameDays = true) : null;
          }
          for (const d of daysB) {
            daysA.includes(d) ? (isSameDays = true) : null;
          }
          daysA.length === 0 && daysB.length === 0 ? (isSameDays = true) : null;
          const fromB = parseFloat(el_B.from.replace(":", "."));
          let toB = parseFloat(el_B.to.replace(":", "."));
          if (toB === 0) {
            toB = 24.0;
          }
          if (
            (fromA < fromB && toA > fromB && isSameDays) ||
            (fromA >= fromB && toA <= toB && isSameDays) ||
            (fromA < toB && toA > toB && isSameDays)
          ) {
            console.log(fromA, toA);
            console.log(fromB, toB);
            isError = true;
          }
        }
      }
    }
    return isError;
  }

  compareFromToHours(list: PriceListDTO) {
    for (const i in list.hours) {
      const el = list.hours[i];
      const from = parseFloat(el.from);
      let to = parseFloat(el.to);
      to == 0 ? (to = 24) : null;
      if (from >= to) {
        return true;
      }
    }
    return false;
  }
}
