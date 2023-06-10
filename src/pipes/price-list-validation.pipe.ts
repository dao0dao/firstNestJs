import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from "@nestjs/common";
import { HoursDTO } from "src/routs/protected-routs/price-list/price-list.dto";
import { writeErrorToLog } from "src/utils/writeLogs";

@Injectable()
export class PriceListValidationPipe implements PipeTransform {
  transform(body: any, metadata: ArgumentMetadata) {
    const isCorrect = this.isCorrectPriceList(body, metadata);
    if (!isCorrect.status) {
      const err = {
        property: "Price list Hours",
        constraints: { 0: "wrong hours fields" },
        value: isCorrect.value,
      } as ValidationError;
      if (process.env.MODE === "dev") {
        writeErrorToLog([err]);
      }
      throw new BadRequestException("Validation failed");
    }
    return body;
  }

  private isCorrectPriceList(body: any, metadata: ArgumentMetadata) {
    const error = { status: false, value: "not acceptable" };
    if (metadata.type !== "body") {
      return { status: true, value: "" };
    }
    if (typeof body !== "object") {
      return error;
    }
    if (body.hours) {
      const timeRegExp = /\d{2}:\d{2}/;
      const hours: HoursDTO[] = Object.values(body.hours);
      for (const h of hours) {
        if (
          !timeRegExp.test(h.from) ||
          !timeRegExp.test(h.to) ||
          !this.isPrice(h.price)
        ) {
          return error;
        }
        for (const d of h.days) {
          if (!Number.isInteger(d)) {
            return error;
          }
        }
      }
    }
    return { status: true, value: "" };
  }

  private isPrice(value: number | string) {
    const regexp = /^\d+(\.\d{1,2})?$/;
    if (typeof value === "number") {
      return value >= 0;
    } else {
      return regexp.test(value);
    }
  }
}
