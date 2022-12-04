import { Module } from "@nestjs/common";
import { APP_GUARD, APP_PIPE, RouterModule, RouteTree } from "@nestjs/core";
//services
import { AppService } from "./app.service";
import { SessionsService } from "./utils/shared/session.service";
//rout controller
import { AppController } from "./app.controller";
//env
import {
  envConfig,
  sequelizeIntegration,
  staticFolder,
} from "./app.module.config";
import { ClassValidationPipe } from "./pipes/class-validation.pipe";
import { AuthGuard } from "./guards/auth.guard";
//modules
import { LoginModule } from "./routs/login/login.module";
import { SharedModule } from "./utils/shared/shared.module";
import { AdministratorModule } from "./routs/administrator/administrator.module";
import { PlayerModule } from "./routs/player/player.module";
import { PriceListModule } from "./routs/price-list/price-list.module";
import { TimetableModule } from "./routs/timetable/timetable.module";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [
      LoginModule,
      AdministratorModule,
      PlayerModule,
      PriceListModule,
      TimetableModule,
    ],
  },
];

@Module({
  imports: [
    envConfig,
    staticFolder,
    sequelizeIntegration,
    RouterModule.register(routs),
    LoginModule,
    SharedModule,
    AdministratorModule,
    PlayerModule,
    PriceListModule,
    TimetableModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ClassValidationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
  exports: [],
})
export class AppModule {
  constructor(private readonly session: SessionsService) {
    this.session.clearOldSessions();
    setInterval(() => {
      this.session.clearOldSessions();
    }, 1 * 3600 * 1000);
  }
}
