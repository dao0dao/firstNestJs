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

const routs: RouteTree[] = [
  {
    path: "api",
    children: [{ path: "login", module: LoginModule }],
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
export class AppModule {}
