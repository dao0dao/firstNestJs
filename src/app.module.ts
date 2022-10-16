import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  envConfig,
  sequelizeIntegration,
  staticFolder,
} from "./app.module.config";
import { LoginModule } from "./login/login.module";
import { APP_PIPE, RouterModule, RouteTree } from "@nestjs/core";
import { SharedModule } from "./utils/shared/shared.module";
import { ClassValidationPipe } from "./class-validation.pipe";
import { SessionsService } from "./utils/shared/session.service";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [LoginModule],
  },
];

@Module({
  imports: [
    envConfig,
    staticFolder,
    sequelizeIntegration,
    LoginModule,
    RouterModule.register(routs),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ClassValidationPipe }],
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
