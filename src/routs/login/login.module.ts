import { Module } from "@nestjs/common";
import { UserModule } from "src/routs/protected-routs/user/user.module";
import { SharedModule } from "src/utils/shared/shared.module";
import { LoginController } from "./login.controller";
import { LoginService } from "./login.service";
import { LogoutController } from "./logout.controller";

@Module({
  imports: [SharedModule, UserModule],
  controllers: [LoginController, LogoutController],
  providers: [LoginService],
})
export class LoginModule {}
