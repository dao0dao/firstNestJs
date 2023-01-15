import { Module } from "@nestjs/common";
import { APP_GUARD, RouterModule, RouteTree } from "@nestjs/core";
import { AuthGuard } from "src/guards/auth.guard";
import { SharedModule } from "src/utils/shared/shared.module";
import { AdministratorModule } from "./administrator/administrator.module";
import { PlayerHistoryModule } from "./player-history/player-history.module";
import { PlayerModule } from "./player/player.module";
import { PriceListModule } from "./price-list/price-list.module";
import { TimetableModule } from "./timetable/timetable.module";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [
      AdministratorModule,
      PlayerModule,
      PriceListModule,
      TimetableModule,
      PlayerHistoryModule,
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
  ],
  exports: [
    AdministratorModule,
    PlayerModule,
    PriceListModule,
    TimetableModule,
    PlayerHistoryModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
})
export class ProtectedRoutsModule {
  constructor() {
    console.log(1);
  }
}
