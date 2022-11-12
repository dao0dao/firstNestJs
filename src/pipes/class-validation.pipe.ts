import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { access, mkdir, writeFile } from "node:fs/promises";
import { join } from "path";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";
import { logsFolderPath } from "src/utils/staticFiles";

@Injectable()
export class ClassValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      if (process.env.MODE === "dev") {
        this.writeErrorToLog(errors);
      }
      throw new BadRequestException("Validation failed");
    }
    return value;
  }

  private toValidate(metatype): boolean {
    // eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private async writeErrorToLog(errors: ValidationError[]) {
    const checkFolder = new Promise<boolean>((resolve, reject) => {
      access(logsFolderPath)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
    });
    const isFolderExist = await checkFolder;
    if (!isFolderExist) {
      await mkdir(logsFolderPath);
    }
    this.createErrorLog(errors);
  }

  private createErrorLog(errors: ValidationError[]) {
    let content = "";
    for (const e of errors) {
      const obj = {
        name: e.property,
        constraints: e.constraints,
        value: e.value,
      };
      content = content + e.toString() + JSON.stringify(obj) + "\n ----- \n";
    }
    const date = new Date();
    const fileName = date.toISOString().replace(/:/g, "-") + ".log";
    const pathToFile = join(logsFolderPath, fileName);
    writeFile(pathToFile, content, { encoding: "utf-8" });
  }
}
