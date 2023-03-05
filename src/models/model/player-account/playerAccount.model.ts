import {
  Table,
  Model,
  Column,
  BelongsTo,
  ForeignKey,
  DataType,
} from "sequelize-typescript";
import { Player } from "../player/player.models";

@Table({ modelName: "player_account", freezeTableName: true })
export class PlayerAccount extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column(DataType.DECIMAL(10, 2))
  wallet: string;

  @ForeignKey(() => Player)
  @Column
  playerId: string;

  @BelongsTo(() => Player)
  player: Player;
}
