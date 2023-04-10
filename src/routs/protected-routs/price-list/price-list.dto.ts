import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export interface Hours {
  [key: number]: HoursDTO;
}

export class PriceListDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(150)
  name: string;

  @IsNumber()
  @IsPositive()
  defaultPrice: number;

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
}
