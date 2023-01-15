import { Controller, Get, Query } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { PlayerHistoryHandleDataService } from "./player-history-handle-data.service";
import {
  PlayerHistoryOutputDTO,
  PlayerHistoryQuery,
} from "./player-history.dto";

@Controller("player/history")
export class PlayerHistoryController {
  constructor(
    private playerHistoryModel: PlayerHistoryModelService,
    private handleData: PlayerHistoryHandleDataService
  ) {}

  @Get()
  @Role("login")
  async getPlayerHistoryByDate(@Query() query: PlayerHistoryQuery) {
    const { dateFrom, dateTo, playerId } = query;
    const history = await this.playerHistoryModel.getPlayerHistoryByDate(
      playerId,
      dateTo,
      dateFrom
    );
    const data: PlayerHistoryOutputDTO =
      this.handleData.parsePlayerHistoryToDTO(history);
    return data;
  }
}
