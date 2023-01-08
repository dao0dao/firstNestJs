import { IsUUID, Matches } from "class-validator";

export class PlayerHistoryQuery {
  @IsUUID()
  playerId: string;

  @Matches(/\d{4}-\d{2}-\d{2}|^$/)
  dateFrom: string;

  @Matches(/\d{4}-\d{2}-\d{2}/)
  dateTo: string;
}
