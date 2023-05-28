import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistorySQL } from "./model/player-history/player-history.service";
import { mysqlTables } from "./mysql-tables";
import { TimetableSQLService } from "./model/timetable/timetable-sql.service";
import { PriceListSQL } from "./model/price-list/price-list.service";
import { PlayerSQL } from "./model/player/player.service";
import { PlayerAccountSQL } from "./model/player-account/player-account.service";
import { UserServicesSQL } from "./model/user-servicec/user-services.service";

const models = [
  PlayerHistorySQL,
  TimetableSQLService,
  PriceListSQL,
  PlayerSQL,
  PlayerAccountSQL,
  UserServicesSQL,
];

@Module({
  imports: [SequelizeModule.forFeature(mysqlTables)],
  providers: models,
  exports: models,
})
export class ModelsModule {}
