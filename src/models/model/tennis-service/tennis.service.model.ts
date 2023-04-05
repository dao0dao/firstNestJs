import { Table, Model, Column } from "sequelize-typescript";

@Table({ modelName: "services", freezeTableName: true })
export class TennisService extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column
  price: string;
}
