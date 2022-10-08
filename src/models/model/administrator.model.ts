import { Table, Column, Model } from "sequelize-typescript";

@Table
export class Administrator extends Model {
  @Column({ primaryKey: true })
  id: string;

  @Column
  name: string;

  @Column
  login: string;

  @Column
  password: string;

  @Column
  isAdmin: boolean;
}
