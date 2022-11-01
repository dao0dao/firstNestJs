import { Table, Model, Column, BelongsTo } from "sequelize-typescript";
import { Player } from "./player.models";

@Table({ modelName: "player_account" })
export class PlayerAccount extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  wallet: number;

  @BelongsTo(() => Player, "id")
  @Column
  playerId: string;

  @BelongsTo(() => Player, "name")
  playerName: string;

  @BelongsTo(() => Player, "surname")
  playerSurname: string;
}
