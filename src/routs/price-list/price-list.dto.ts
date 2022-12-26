import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";

export class Hours {
  [key: number]: HoursDTO;
  defaultPrice: number;
}

export class PriceListDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @ValidateNested()
  hours: Hours;
}

export class PriceListQueryDTO {
  @IsUUID()
  id: string;
}

export class HoursDTO {
  from: string;
  to: string;
  price: number;
  days: number[];

  static fields = {} as HoursDTO;

  static isCorrect(data: HoursDTO) {
    this.fields = {
      from: "",
      to: "",
      price: 0,
      days: [],
    };
    const keysCount = Object.keys(this.fields).length;
    const dataKeysCount = Object.keys(data).length;
    if (keysCount !== dataKeysCount) {
      return false;
    }
    const keys = Object.keys(this.fields);
    const dataKeys = Object.keys(data);
    for (const k of dataKeys) {
      if (!keys.includes(k)) {
        return false;
      }
    }
    const regExp = /^\d{2}:\d{2}$/;
    if (!data.from.match(regExp) || !data.to.match(regExp)) {
      return false;
    }
    const numberRegExp = /^\d{1,}(\.\d{1,2}){0,1}$/;
    if (!data.price.toString().match(numberRegExp)) {
      return false;
    }
    if (!data.days.length) {
      return false;
    }
    for (const el of data.days) {
      if (typeof el !== "number") {
        return false;
      }
    }
    return true;
  }
}
