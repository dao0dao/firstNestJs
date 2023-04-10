import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ValidationError } from "class-validator";
import { HoursDTO } from "src/routs/protected-routs/price-list/price-list.dto";
import { writeErrorToLog } from "src/utils/writeLogs";

class HourValidation {
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

@Injectable()
export class OptionalPriceListHourValidationPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    const isCorrect = this.isHourInterfaceCorrect(body, metadata);
    if (!isCorrect.status) {
      const err = {
        property: "Price list Hours",
        constraints: { 0: "wrong hours fields" },
        value: isCorrect.value,
      } as ValidationError;
      writeErrorToLog([err]);
      throw new BadRequestException("Validation failed");
    }
    return body;
  }

  private isHourInterfaceCorrect(body: any, metadata: ArgumentMetadata) {
    if (metadata.type !== "body") {
      return { status: true };
    }
    if (typeof body !== "object") {
      return { status: false, value: "body is not object" };
    }
    const bodyKeys = Object.keys(body);
    if (!bodyKeys.includes("hours")) {
      return { status: true };
    }
    if (typeof body.hours !== "object") {
      return { status: false, value: "hours is not object" };
    }
    const hours = body.hours;
    const hourKeys = Object.keys(hours);
    for (const k of hourKeys) {
      if (!(Number.isInteger(parseInt(k)) && parseInt(k) >= 0)) {
        return { status: false, value: "wrong hours keys" };
      }
    }
    const hourArr: HoursDTO[] = Object.values(hours);
    for (const h of hourArr) {
      const isCorrect = HourValidation.isCorrect(h);
      if (!isCorrect) {
        return { status: false, value: "wrong data in hours" };
      }
    }
    return { status: true };
  }
}
