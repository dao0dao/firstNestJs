import {
  Table,
  Model,
  Column,
  DataType,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import { Opponent } from "./opponent.model";
import { PlayerAccount } from "./playerAccount.model";

@Table({ modelName: "players" })
export class Player extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Column
  surname: string;

  @Column
  telephone: number;

  @Column
  email: string;

  @Column
  court: number;

  @Column
  stringsName: string;

  @Column
  tension: string;

  @Column
  balls: string;

  @Column
  weeks: string;

  @Column
  notes: string;

  @HasMany(() => Opponent)
  opponents: Opponent[];

  @HasOne(() => PlayerAccount, "id")
  account: PlayerAccount;
}
