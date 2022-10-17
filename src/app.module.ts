import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  envConfig,
  sequelizeIntegration,
  staticFolder,
} from "./app.module.config";
import { LoginModule } from "./login/login.module";
import {
  APP_GUARD,
  APP_INTERCEPTOR,
  APP_PIPE,
  RouterModule,
  RouteTree,
} from "@nestjs/core";
import { SharedModule } from "./utils/shared/shared.module";
import { ClassValidationPipe } from "./pipes/class-validation.pipe";
import { SessionsService } from "./utils/shared/session.service";
import { AdministratorModule } from "./administrator/administrator.module";
import { AuthGuard } from "./guards/auth.guard";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [LoginModule, AdministratorModule],
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
