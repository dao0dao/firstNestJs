import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { ValidationError } from "class-validator";
import { HoursDTO } from "src/routs/price-list/price-list.dto";
import { writeErrorToLog } from "src/utils/writeLogs";

@Injectable()
export class PriceListHourValidationPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    const isCorrect = this.isHourInterfaceCorrect(body, metadata);
    if (!isCorrect) {
      const err = {
        property: "Price list Hours",
        constraints: { 0: "wrong fields" },
        value: "check HoursDTO",
      } as ValidationError;
      writeErrorToLog([err]);
      throw new BadRequestException("Validation failed");
    }
    return body;
  }

  private isHourInterfaceCorrect(body: any, metadata: ArgumentMetadata) {
    if (metadata.type !== "body") {
      return true;
    }
    if (typeof body !== "object") {
      return false;
    }
    const allowedKeys = ["name", "hours"];
    const bodyKeys = Object.keys(body);
    for (const k of allowedKeys) {
      if (!bodyKeys.includes(k)) {
        return false;
      }
    }
    if (typeof body.name !== "string") {
      return false;
    }
    if (typeof body.hours !== "object") {
      return false;
    }
    const hours = body.hours;
    const hourKeys = Object.keys(hours);
    for (const k of hourKeys) {
      if (!(Number.isInteger(parseInt(k)) && parseInt(k) >= 0)) {
        return false;
      }
    }
    const hourArr: HoursDTO[] = Object.values(hours);
    for (const h of hourArr) {
      const isCorrect = HoursDTO.isCorrect(h);
      if (!isCorrect) {
        return false;
      }
    }
    return true;
  }
}
