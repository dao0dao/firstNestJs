import {
  IsOptional,
  IsString,
  Length,
  IsUUID,
  IsNumber,
  ValidateNested,
  IsBoolean,
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

class Payment {
  @IsOptional()
  @IsNumber()
  hourCount: number;
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

  @IsOptional()
  @IsNumber()
  layer: number;

  @ValidateNested()
  form: Form;

  @IsOptional()
  @ValidateNested()
  payment: Payment;

  @IsOptional()
  @IsBoolean()
  isEditable?: boolean; //zależy czy admin czy nie

  @IsOptional()
  @IsBoolean()
  isPlayerOnePayed: boolean;

  @IsOptional()
  @IsBoolean()
  isPlayerTwoPayed: boolean;

  @IsOptional()
  @IsBoolean()
  isFirstPayment?: boolean;
}

export interface OutputReservationDTO {
  id?: string;
  timetable: {
    transformY: number;
    transformX: number;
    ceilHeight: number;
    layer: number;
  };
  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: string;
    playerOne: Player | undefined;
    playerTwo: Player | undefined;
    guestOne: string;
    guestTwo: string;
  };
  payment?: {
    hourCount: number;
  };

  isEditable?: boolean; //zależy czy admin czy nie
  isPlayerOnePayed?: boolean;
  isPlayerTwoPayed?: boolean;
  isFirstPayment?: boolean;
}

interface Player {
  id: string;
  name: string;
  surname: string;
  telephone: string;
}
