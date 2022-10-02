import { Controller, Get, HttpException, Res } from "@nestjs/common";
import { Response } from "express";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/")
  getIndex(@Res() res: Response) {
    return this.appService.getIndex(res);
  }
  @Get("*")
  returnForbidden(): HttpException {
    return this.appService.returnBadRequest();
  }
}
