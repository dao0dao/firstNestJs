/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class Service {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  price: number;
}

export class ServicesDTO {
  @ValidateNested({ each: true })
  @Type(() => Service)
  services: Service[];
}
