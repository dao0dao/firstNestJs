import { Module } from "@nestjs/common";
import { APP_GUARD, RouterModule, RouteTree } from "@nestjs/core";
import { AuthGuard } from "src/guards/auth.guard";
import { SharedModule } from "src/utils/shared/shared.module";
import { AdministratorModule } from "./administrator/administrator.module";
import { PlayerHistoryModule } from "./player-history/player-history.module";
import { PlayerModule } from "./player/player.module";
import { PriceListModule } from "./price-list/price-list.module";
import { TimetableModule } from "./timetable/timetable.module";
import { DebtorModule } from "./debtor/debtor.module";
import { TennisServicesModule } from "./tennis-services/tennis.services.module";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [
      AdministratorModule,
      PlayerModule,
      PriceListModule,
      TimetableModule,
      PlayerHistoryModule,
      DebtorModule,
      TennisServicesModule,
    ],
  },
];

@Module({
  imports: [
    SharedModule,
    RouterModule.register(routs),
    AdministratorModule,
    PlayerModule,
    PriceListModule,
    TimetableModule,
    PlayerHistoryModule,
    DebtorModule,
    TennisServicesModule,
  ],
  exports: [
    AdministratorModule,
    PlayerModule,
    PriceListModule,
    TimetableModule,
    PlayerHistoryModule,
    DebtorModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
  controllers: [],
})
export class ProtectedRoutsModule {}
