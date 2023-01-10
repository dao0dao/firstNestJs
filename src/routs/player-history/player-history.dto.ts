import { IsUUID, Matches } from "class-validator";
import { Model } from "sequelize-typescript";

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
}
