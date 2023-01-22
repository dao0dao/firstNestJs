import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import { Player } from "../player/player.models";

@Table({ modelName: "player_account", freezeTableName: true })
export class PlayerAccount extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  wallet: number;

  @ForeignKey(() => Player)
  @Column
  playerId: string;

  @BelongsTo(() => Player)
  player: Player;
}
