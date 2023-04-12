import { Table, Column, Model } from "sequelize-typescript";
@Table({ modelName: "sessions", freezeTableName: true })
export class Sessions extends Model {
  @Column({ primaryKey: true })
  id: number;
  @Column
  session_id: string;
  @Column
  expired_at: string;
  @Column
  administrator_id: string;
}
