import { IsOptional, IsString, IsUUID, ValidateNested } from "class-validator";
import { Hours } from "src/models/model/priceList.model";

export class PriceListDTO {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @ValidateNested()
  hours: Hours;
}
