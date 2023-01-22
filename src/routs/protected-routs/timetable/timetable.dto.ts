import { Type } from "class-transformer";
import {
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsNumber,
  ValidateNested,
  Matches,
  MaxLength,
  MinLength,
  Min,
  Max,
} from "class-validator";

class Form {
  @IsString()
  @MaxLength(10)
  @MinLength(10)
  date: string;

  @IsString()
  @Length(5, 5)
  timeFrom: string;

  @IsString()
  @Length(5, 5)
  timeTo: string;

  @IsNumber()
  @Min(1)
  @Max(3)
  court: number;

  @IsOptional()
  @IsUUID()
  playerOne: string;

  @IsOptional()
  @IsUUID()
  playerTwo: string;

  @IsOptional()
  @IsString()
  guestOne: string;

  @IsOptional()
  @IsString()
  guestTwo: string;
}

export class TimetableQuery {
  @IsString()
  @Length(10, 10)
  date: string;
}

export class InputReservationDTO {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNumber()
  layer: number;

  @ValidateNested()
  @Type(() => Form)
  form: Form;
}

export class InputUpdateReservationDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  layer: number;

  @ValidateNested()
  @Type(() => Form)
  form: Form;
}

export interface OutputReservationDTO {
  id: number;
  timetable: {
    layer: number;
  };
  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: string;
    playerOne: ReservationPlayerDTO | undefined;
    playerTwo: ReservationPlayerDTO | undefined;
    guestOne: string;
    guestTwo: string;
  };
  payment: {
    hourCount: number;
  };
  isEditable: boolean; //zależy czy admin czy nie
  isPlayerOnePayed: boolean;
  isPlayerTwoPayed: boolean;
  isFirstPayment: boolean;
}

export interface ReservationPlayerDTO {
  id: string;
  name: string;
  surname: string;
  telephone: string;
}

export interface CreateReservationDTO {
  status: "created";
}

export class TimetableDeleteParam {
  @Matches(/\d/)
  id: number;
}
