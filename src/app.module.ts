import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_PIPE, RouterModule, RouteTree } from "@nestjs/core";
import { AppService } from "./app.service";
import { SessionsService } from "./utils/shared/session.service";
import { AppController } from "./app.controller";
import {
  envConfig,
  sequelizeIntegration,
  staticFolder,
} from "./app.module.config";
import { ClassValidationPipe } from "./pipes/class-validation.pipe";
import { LoginModule } from "./routs/login/login.module";
import { SharedModule } from "./utils/shared/shared.module";
import { ProtectedRoutsModule } from "./routs/protected-routs/protected-routs.module";
import { ModelsModule } from "./models/models.module";
import { HeadersMiddleware } from "./midelwares/headers/headers.middleware";

const routs: RouteTree[] = [
  {
    path: "api",
    children: [LoginModule],
  },
  {
    path: "",
    module: ProtectedRoutsModule,
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
    ProtectedRoutsModule,
    ModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_PIPE, useClass: ClassValidationPipe }],
  exports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HeadersMiddleware).forRoutes({ method: 5, path: "*" });
  }
  constructor(private readonly session: SessionsService) {
    this.session.clearOldSessions();
    setInterval(() => {
      this.session.clearOldSessions();
    }, 1 * 3600 * 1000);
  }
}
