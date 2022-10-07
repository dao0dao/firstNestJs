import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import {
  envConfig,
  sequelizeIntegration,
  staticFolder,
} from "./app.module.config";
import { LoginModule } from "./login/login.module";
import { RouterModule, RouteTree } from "@nestjs/core";
import { SharedModule } from "./utils/shared/shared.module";

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
  providers: [AppService],
  exports: [],
})
export class AppModule {}
