import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Player } from "./player/player.models";

@Table({ modelName: "opponents", freezeTableName: true })
export class Opponent extends Model {
  @Column({ primaryKey: true, autoIncrement: true, allowNull: true })
  id: number;

  @Column
  opponentId: string;

  @ForeignKey(() => Player)
  @Column
  playerId: string;

  @BelongsTo(() => Player)
  player: Player;
}
