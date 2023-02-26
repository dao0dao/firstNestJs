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
import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";

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
    court: number;
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
  playersHistory: boolean | { playerTwo?: boolean; playerOne?: boolean };
}

export class TimetableIdParam {
  @Matches(/\d/)
  id: number;
}

export interface PlayerHistoryPrice {
  is_paid: boolean;
  player_position: number;
  price: number;
  player: {
    id: string;
    name: string;
    surname: string;
  };
}

export interface OutputReservationPrice {
  prices: PlayerHistoryPrice[];
}

export class PlayerPayment {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  name: string;

  @IsString()
  @Matches(/payment|cash|transfer|debet/)
  method: "payment" | "cash" | "transfer" | "debet";

  @IsNumber()
  value: number;
}

export class InputReservationPayment {
  @IsNumber()
  reservationId: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlayerPayment)
  playerOne?: PlayerPayment;

  @IsOptional()
  @ValidateNested()
  @Type(() => PlayerPayment)
  playerTwo?: PlayerPayment;
}
