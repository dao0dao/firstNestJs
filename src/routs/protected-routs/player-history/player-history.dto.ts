import { IsNumber, IsString, IsUUID, Matches, Min } from "class-validator";

const paymentMethodRegExp = /payment|cash|transfer|debet|charge/;

export class PlayerHistoryQuery {
  @IsUUID()
  playerId: string;

  @Matches(/\d{4}-\d{2}-\d{2}|^$/)
  dateFrom: string;

  @Matches(/\d{4}-\d{2}-\d{2}/)
  dateTo: string;
}

export interface HistoryOutputDTO {
  id: number;
  serviceDate: string;
  serviceName: string;
  price: number;
  isPaid: boolean;
  paymentMethod: string;
  paymentDate: string;
  cashier: string;
}

export interface PlayerHistoryOutputDTO {
  history: HistoryOutputDTO[];
  totalPrice: number;
  balance: string;
}

export class InputPayForHistory {
  @IsNumber()
  @Min(0)
  id: number;

  @IsString()
  @Matches(paymentMethodRegExp)
  payment_method: string;

  @IsString()
  price: string;
}

export class PlayerHistoryParam {
  @IsString()
  id: string;
}
