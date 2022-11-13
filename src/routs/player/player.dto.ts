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

interface OpponentInputDto {
  id: string;
}

interface Week {
  days: {
    0?: boolean | undefined;
    1?: boolean | undefined;
    2?: boolean | undefined;
    3?: boolean | undefined;
    4?: boolean | undefined;
    5?: boolean | undefined;
    6?: boolean | undefined;
  };
  time: {
    from: string;
    to: string;
  };
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
  account?: number;

  @ValidateIf((c) => c.email != "")
  @IsEmail()
  email: string;

  @IsOptional()
  @ValidateIf((c) => c.priceListId != "")
  @IsUUID()
  priceListId: string;

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
  opponents: OpponentInputDto[];
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

// export class PlayerOutputDTO extends PlayerInputDTO {
//   opponents: OpponentOutputDTO[];
// }
