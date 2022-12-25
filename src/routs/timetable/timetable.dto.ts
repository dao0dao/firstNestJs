import {
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsNumber,
  ValidateNested,
} from "class-validator";

class Form {
  @IsString()
  @Length(10, 10)
  date: string;

  @IsString()
  @Length(5, 5)
  timeFrom: string;

  @IsString()
  @Length(5, 5)
  timeTo: string;

  @IsString()
  @Length(1, 1)
  court: string;

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
  @IsUUID()
  id: string;

  @IsNumber()
  layer: number;

  @ValidateNested()
  form: Form;
}

export class InputUpdateReservationDTO {
  @IsUUID()
  id: string;

  @IsNumber()
  layer: number;

  @ValidateNested()
  form: Form;
}

export interface OutputReservationDTO {
  id: string;
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
