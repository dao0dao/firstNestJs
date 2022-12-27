import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export interface Hours {
  [key: number]: HoursDTO;
}

export class PriceListDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsNumber()
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
