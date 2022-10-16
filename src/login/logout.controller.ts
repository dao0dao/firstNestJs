import {
  Controller,
  Get,
  Res,
  Req,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SessionsService } from "src/utils/shared/session.service";

@Controller("logout")
export class LogoutController {
  constructor(private sessionService: SessionsService) {}

  @Get()
  async logout(@Req() req: Request, @Res() res: Response) {
    if (!req.cookies.key) {
      throw new HttpException("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
    }
    const session = await this.sessionService.removeSession(req.cookies.key);
    if (!session) {
      throw new HttpException(
        { readWrite: true },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    res.clearCookie("key", { httpOnly: true, secure: true, path: "/" });
    res.json({ status: "logout" });
  }
}
