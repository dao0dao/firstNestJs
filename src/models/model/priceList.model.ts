import { Table, Model, Column, DataType } from "sequelize-typescript";
import { Hours } from "src/routs/price-list/price-list.dto";

@Table({ modelName: "price_list", freezeTableName: true })
export class PriceList extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Column(DataType.JSON)
  hours: Hours;
}
