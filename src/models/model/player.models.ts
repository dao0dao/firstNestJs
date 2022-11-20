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

export interface Week {
  days: {
    0?: boolean | undefined;
    1?: boolean | undefined;
    2?: boolean | undefined;
    3?: boolean | undefined;
    4?: boolean | undefined;
    5?: boolean | undefined;
    6?: boolean | undefined;
  };
  time: {
    from: string;
    to: string;
  };
}

@Table({ modelName: "players" })
export class Player extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Column
  surname: string;

  @Column
  telephone: string;

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

  @Column(DataType.STRING(255))
  weeks: Week[];

  @Column
  notes: string;

  @HasMany(() => Opponent)
  opponents: Opponent[];

  @HasOne(() => PlayerAccount, "id")
  account: PlayerAccount;
}
