import { Model } from "sequelize";
import { Column, DataType, Table } from "sequelize-typescript";

@Table({ freezeTableName: true, tableName: "services" })
export class TennisServiceModel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column(DataType.DECIMAL(10, 2))
  price: string;
}
