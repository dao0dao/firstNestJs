import { Table, Model, Column, DataType } from "sequelize-typescript";

@Table({ modelName: "timetable", freezeTableName: true })
export class Timetable extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  layer: number;

  @Column
  date: string;

  @Column
  time_from: string;

  @Column
  time_to: string;

  @Column
  court: string;

  @Column
  player_one: string;

  @Column
  player_two: string;

  @Column
  guest_one: string;

  @Column
  guest_two: string;

  @Column
  hour_count: number;

  @Column({ defaultValue: false })
  is_player_one_payed: boolean;

  @Column({ defaultValue: false })
  is_player_two_payed: boolean;

  @Column({ defaultValue: false })
  is_first_payment: boolean;
}
