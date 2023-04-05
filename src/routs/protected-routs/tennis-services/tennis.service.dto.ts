/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from "class-validator";

export class ServiceDTO {
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
  @Type(() => ServiceDTO)
  services: ServiceDTO[];
}

export class ServiceDeleteParam {

  @IsString()
  @Matches(/\d{1,}/)
  id: string
}
