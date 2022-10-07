import { Table, Column, Model } from "sequelize-typescript";
@Table
export class Sessions extends Model {
  @Column({ primaryKey: true })
  id: number;
  @Column
  session_id: string;
  @Column
  expired_at: string;
}
