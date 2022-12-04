import { IsString, Length } from "class-validator";

export interface ReservationOutputDTO {
  id?: string;
  zIndex: number;
  form: {
    date: string;
    timeFrom: string;
    timeTo: string;
    court: string;
    playerOne: string;
    playerTwo: string;
    guestOne: string;
    guestTwo: string;
  };
  payment: {
    hourCount: number;
  };

  isEditable?: boolean; //zależy czy admin czy nie
  isPlayerOnePayed: boolean;
  isPlayerTwoPayed: boolean;
  isFirstPayment?: boolean;
}

export class TimetableQuery {
  @IsString()
  @Length(10, 10)
  date: string;
}
