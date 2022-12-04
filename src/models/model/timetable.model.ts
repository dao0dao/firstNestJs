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
  timeFrom: string;

  @Column
  timeTo: string;

  @Column
  court: string;

  @Column
  playerOne: string;

  @Column
  playerTwo: string;

  @Column
  guestOne: string;

  @Column
  guestTwo: string;

  @Column
  hour_count: number;

  @Column
  is_editable: boolean;

  @Column
  is_player_one_payed: boolean;

  @Column
  is_player_two_payed: boolean;

  @Column
  is_first_payment: boolean;
}
