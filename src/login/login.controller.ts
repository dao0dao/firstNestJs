import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Response, Request } from "express";
import { SessionsService } from "src/utils/shared/session.service";
import { LoginInputDTO } from "./login.dto";
import { LoginService } from "./login.service";

@Controller("login")
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
    const session = await this.sessionService.createSession(login.user_id);
    res.cookie("key", session.key, {
      expires: session.date,
      httpOnly: true,
      secure: true,
      path: "/",
    });
    res.json({
      isLogin: login.isLogin,
      isAdmin: login.isAdmin,
      user: login.user,
    });
  }

  @Get()
  async checkIsLogin(@Req() req: Request) {
    if (!req.cookies.key) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    const session_id = await this.sessionService.findSession(req.cookies.key);
    if (!session_id) {
      throw new HttpException({ session: "fail" }, HttpStatus.UNAUTHORIZED);
    }
    const admin = await this.loginService.checkIsLogin(session_id);
    if (!admin) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    return admin;
  }
}
