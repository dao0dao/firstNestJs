/* eslint-disable prettier/prettier */
import { Type } from "class-transformer";
import {
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
  Min,
  IsUUID,
} from "class-validator";

export class ServiceDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  @MaxLength(50)
  name: string;

  @IsNumber()
  @Min(0)
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
  id: string;
}

export class ServicePaymentDTO {
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(200)
  name: string;

  @IsString()
  @Matches(/payment|cash|transfer|none|debet|charge/)
  paymentMethod: "payment" | "cash" | "transfer" | "none" | "charge" | "debet";

  @IsString()
  @MaxLength(50)
  serviceName: string;

  @IsNumber()
  value: number;
}
