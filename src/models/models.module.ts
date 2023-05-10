import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { PlayerHistoryModelService } from "./model/player-history/player-history.service";
import { mysqlTables } from "./mysql-tables";
import { TimetableSQLService } from "./model/timetable/timetable-sql.service";
import { PriceListService } from "./model/price-list/price-list.service";
import { PlayerSQL } from "./model/player/player.service";
import { PlayerAccountService } from "./model/player-account/player-account.service";
import { TennisServiceResolver } from "./model/tennis-service/tennis.resolver.service";

const models = [
  PlayerHistoryModelService,
  TimetableSQLService,
  PriceListService,
  PlayerSQL,
  PlayerAccountService,
  TennisServiceResolver,
];

@Module({
  imports: [SequelizeModule.forFeature(mysqlTables)],
  providers: models,
  exports: models,
})
export class ModelsModule {}
