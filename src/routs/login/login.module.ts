import { Module } from "@nestjs/common";
import { AdministratorModule } from "src/routs/protected-routs/administrator/administrator.module";
import { SharedModule } from "src/utils/shared/shared.module";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { LogoutController } from "./logout.controller";

@Module({
  imports: [SharedModule, AdministratorModule],
  controllers: [LoginController, LogoutController],
  providers: [LoginService],
})
export class LoginModule {}
