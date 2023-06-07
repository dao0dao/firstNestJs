import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { writeErrorToLog } from "src/utils/writeLogs";

@Injectable()
export class ClassValidationPipe implements PipeTransform {
  async transform(value: any, argumentMetadata: ArgumentMetadata) {
    const { metatype } = argumentMetadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (process.env.MODE === "dev") {
        writeErrorToLog(errors);
      }
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
