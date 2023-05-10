import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Request,
  HttpException,
  HttpStatus,
  Delete,
  Param,
} from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { RequestDTO } from "src/request.dto";
import { PlayerHistoryService } from "./player-history.service";
import {
  InputPayForHistory,
  PlayerHistoryParam,
  PlayerHistoryQuery,
} from "./player-history.dto";

@Controller("player/history")
export class PlayerHistoryController {
  constructor(private playerHistory: PlayerHistoryService) {}

  @Get()
  @Role("login")
  async getPlayerHistoryByDate(@Query() query: PlayerHistoryQuery) {
    const result = await this.playerHistory.getPlayerHistoryByDate(query);
    return result;
  }

  @Post("pay")
  @Role("login")
  async payForHistory(
    @Request() req: RequestDTO,
    @Body() data: InputPayForHistory
  ) {
    const result = await this.playerHistory.setPlayerHistoryAsPaid(
      req.ADMIN_NAME,
      req.ROLE,
      data
    );
    if (result === "accessDenied") {
      throw new HttpException(
        { reason: "Brak uprawnień do zmiany kwoty." },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if (result === "serverIntervalError") {
      throw new HttpException(
        { reason: "Brak wpisu" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    return result;
  }

  @Delete("remove/:id")
  @Role("admin")
  async deleteHistory(@Param() param: PlayerHistoryParam) {
    const result = await this.playerHistory.deletePlayerHistory(param.id);
    if (result === "serverIntervalError") {
      throw new HttpException(
        { reason: "Brak wpisu" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    return result;
  }
}
