import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Player } from "../player.models";
import { Timetable } from "../timetable.model";

@Table({ modelName: "player_history", freezeTableName: true })
export class PlayerHistory extends Model {
  @Column({ primaryKey: true })
  id: number;

  @Column
  @ForeignKey(() => Timetable)
  timetable_id: string;

  @Column
  @ForeignKey(() => Player)
  player_id: string;

  @BelongsTo(() => Player, "playerId")
  player: Player;

  @Column(DataType.DECIMAL(1, 0))
  player_position: number;

  @Column(DataType.DATEONLY)
  service_date: string;

  @Column
  service_name: string;

  @Column
  price: number;

  @Column
  is_paid: boolean;

  @Column
  payment_method: string;

  @Column(DataType.DATEONLY)
  payment_date: string;

  @Column
  cashier: string;
}
