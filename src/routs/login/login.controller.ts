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
    const user = await this.loginService.loginUser(body);
    if (!user) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    const session = await this.sessionService.createSession(
      user.user_id,
      user.user
    );
    return res
      .cookie("key", session.key, {
        expires: session.date,
        httpOnly: true,
        secure: true,
        path: "/",
      })
      .json({
        isLogin: user.isLogin,
        isAdmin: user.isAdmin,
        user: user.user,
      });
  }

  @Get()
  async checkIsLogin(@Req() req: Request) {
    if (!req.cookies || !req.cookies.key) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    const userSession = await this.sessionService.findLoginUserBySessionId(
      req.cookies.key
    );
    if (!userSession) {
      throw new HttpException({ session: "fail" }, HttpStatus.UNAUTHORIZED);
    }
    const user = await this.loginService.checkIsLogin(
      userSession.administrator_id
    );
    if (!user) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
