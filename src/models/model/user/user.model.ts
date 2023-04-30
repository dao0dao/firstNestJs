import { Table, Column, Model, DataType } from "sequelize-typescript";

@Table({ modelName: "administrators", freezeTableName: true })
export class User extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
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
