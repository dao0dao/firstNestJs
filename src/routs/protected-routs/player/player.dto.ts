import {
  IsString,
  ValidateIf,
  MaxLength,
  MinLength,
  IsUUID,
  IsNumber,
  Length,
  IsEmail,
  IsArray,
  ValidateNested,
  IsOptional,
} from "class-validator";
import { Week } from "src/models/model/player/player.models";
import { PriceList } from "src/models/model/price-list/priceList.model";

interface OpponentId {
  id: string;
}

export class PlayerInputDTO {
  @ValidateIf((c) => c.id != undefined)
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(30)
  @MinLength(2)
  surname: string;

  @IsString()
  @MaxLength(9)
  @MinLength(9)
  telephone: string;

  @IsOptional()
  @IsNumber()
  account: number;

  @ValidateIf((c) => c.email != "")
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((c) => c.priceListId != "")
  @IsUUID()
  priceListId?: PriceList;

  @IsNumber()
  court: number;

  @ValidateIf((c) => c.stringsName != "")
  @IsString()
  @Length(0, 250)
  stringsName: string;

  @ValidateIf((c) => c.tension != "")
  @IsString()
  @Length(0, 250)
  tension: string;

  @ValidateIf((c) => c.balls != "")
  @IsString()
  @Length(0, 150)
  balls: string;

  @ValidateIf((c) => c.court != "")
  @IsString()
  @Length(0, 500)
  notes: string;

  @ValidateIf((c) => c.weeks != undefined && c.weeks?.length != 0)
  @IsArray()
  @ValidateNested({ each: true })
  weeks: Week[];

  @ValidateIf((c) => c.opponents != undefined && c.opponents?.length != 0)
  @IsArray()
  @ValidateNested({ each: true })
  opponents: OpponentId[];
}

export class PlayerIdParamDTO {
  @IsUUID()
  id: string;
}

export interface OpponentOutputDTO {
  id: string;
  name: string;
  surname: string;
}

export class PlayerOutputDTO {
  id: string;
  name: string;
  surname: string;
  telephone: string;
  account: string;
  email: string;
  priceListId: string;
  court: number;
  stringsName: string;
  tension: string;
  balls: string;
  notes: string;
  weeks: Week[];
  opponents: OpponentOutputDTO[];
}
