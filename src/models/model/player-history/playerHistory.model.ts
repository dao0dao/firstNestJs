import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Player } from "../player/player.models";
import { Timetable } from "../timetable/timetable.model";

@Table({ modelName: "player_history", freezeTableName: true })
export class PlayerHistory extends Model {
  @Column({ primaryKey: true })
  id: number;

  @Column
  @ForeignKey(() => Timetable)
  timetable_id: number;

  @Column
  @ForeignKey(() => Player)
  player_id: string;

  @BelongsTo(() => Player, "player_id")
  player: Player;

  @Column(DataType.DECIMAL(1, 0))
  player_position: string;

  @Column(DataType.DATEONLY)
  service_date: string;

  @Column
  service_name: string;

  @Column(DataType.DECIMAL(10, 2))
  price: string;

  @Column
  is_paid: boolean;

  @Column
  payment_method: "payment" | "cash" | "transfer" | "none" | "charge" | "debet";

  @Column(DataType.DATEONLY)
  payment_date: string;

  @Column
  cashier: string;
}

export interface CreateTimetableHistory {
  id?: number;
  timetable_id: number;
  player_id: string;
  player_position?: number;
  service_date: string;
  service_name: string;
  price: string;
  is_paid: boolean;
  payment_method?: string;
  payment_date?: string;
  cashier?: string;
}

export interface TimetableHistoryPlayers {
  playerOne?: {
    id: string;
    priceListId: string;
  };
  playerTwo?: {
    id: string;
    priceListId: string;
  };
}
