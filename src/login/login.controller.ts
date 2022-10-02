import { Body, Controller, Post } from "@nestjs/common";
import { LoginInputDTO } from "./login.dto";
import { LoginService } from "./login.service";

@Controller()
export class LoginController {
  constructor(private loginService: LoginService) {}
  @Post()
  logIn(@Body() body: LoginInputDTO) {
    return this.loginService.login(body);
  }
}
