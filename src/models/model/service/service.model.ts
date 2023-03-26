import { Model } from "sequelize";
import { Column, DataType } from "sequelize-typescript";

export class Service extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
  id: number;

  @Column
  name: string;

  @Column(DataType.DECIMAL(10, 2))
  price: string;
}
