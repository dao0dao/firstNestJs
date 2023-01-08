import { Controller, Get, Query } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { PlayerHistoryQuery } from "./player-history.dto";

@Controller("player/history")
export class PlayerHistoryController {
  constructor(private playerHistoryModel: PlayerHistoryModelService) {}

  @Get()
  @Role("login")
  getPlayerHistoryByDate(@Query() query: PlayerHistoryQuery) {
    const { dateFrom, dateTo, playerId } = query;
    return this.playerHistoryModel.getPlayerHistoryByDate(
      playerId,
      dateTo,
      dateFrom
    );
  }
}
