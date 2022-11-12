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
  telephone: number;

  @ValidateIf((c) => c.account != undefined)
  @IsNumber()
  account: number;

  @ValidateIf((c) => c.email != undefined)
  @IsEmail()
  email: string;

  @ValidateIf((c) => c.priceListId != "")
  @IsUUID()
  priceListId: string;

  @ValidateIf((c) => c.court != undefined)
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
