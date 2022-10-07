import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { SessionsService } from "src/utils/shared/session.service";
import { LoginInputDTO } from "./login.dto";
import { LoginService } from "./login.service";

@Controller()
export class LoginController {
  constructor(
    private loginService: LoginService,
    private sessionService: SessionsService
  ) {}
  @Post()
  async logIn(@Res() res: Response, @Body() body: LoginInputDTO) {
    const login = await this.loginService.login(body);
    if (!login) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    const session = await this.sessionService.createSession();
    res.cookie("key", session.key, {
      expires: session.date,
      httpOnly: true,
      secure: true,
      path: "/",
    });
    res.json(login);
  }

  @Get()
  checkIsLogin() {
    return { status: "ok" };
  }
}
