import { Table, Model, Column, DataType } from "sequelize-typescript";
export type Hours = {
  [key: number]: {
    from: string;
    to: string;
    price: number;
    days?: number[];
  };
  defaultPrice: number;
};

@Table({ modelName: "price_list" })
export class PriceList extends Model {
  @Column({ primaryKey: true, defaultValue: DataType.UUIDV4 })
  id: string;

  @Column
  name: string;

  @Column(DataType.STRING)
  hours: Hours;
}
