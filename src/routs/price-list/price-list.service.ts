import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Role } from "src/guards/roles.decorators";
import { PriceList } from "src/models/model/priceList.model";

@Injectable()
@Role("admin")
export class PriceListService {
  constructor(
    @InjectModel(PriceList) private priceListMode: typeof PriceList
  ) {}
}
