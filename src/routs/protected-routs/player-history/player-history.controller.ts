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
import { PlayerAccountService } from "src/models/model/player-account/player-account.service";
import { PlayerHistoryModelService } from "src/models/model/player-history/player-history.service";
import { RequestDTO } from "src/request.dto";
import { PlayerHistoryHandleDataService } from "./player-history-handle-data.service";
import {
  InputPayForHistory,
  PlayerHistoryOutputDTO,
  PlayerHistoryParam,
  PlayerHistoryQuery,
} from "./player-history.dto";

@Controller("player/history")
export class PlayerHistoryController {
  constructor(
    private playerHistoryModel: PlayerHistoryModelService,
    private handleData: PlayerHistoryHandleDataService,
    private accountModel: PlayerAccountService
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
    const playerBalance = await this.accountModel.getPlayerWalletById(playerId);
    const data: PlayerHistoryOutputDTO =
      this.handleData.parsePlayerHistoryToDTO(history, playerBalance);
    return data;
  }

  @Post("pay")
  @Role("login")
  async payForHistory(
    @Request() req: RequestDTO,
    @Body() data: InputPayForHistory
  ) {
    const result = await this.handleData.payForHistory(
      data,
      req.ADMIN_NAME,
      req.ROLE
    );
    if ("object" === typeof result) {
      if (result.access_denied)
        throw new HttpException(
          { reason: "Brak uprawnień do zmiany kwoty." },
          HttpStatus.NOT_ACCEPTABLE
        );
      if (result.no_history)
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
    const history = await this.playerHistoryModel.getPlayerHistoryById(
      parseInt(param.id)
    );
    if (!history) {
      throw new HttpException(
        { reason: "Brak wpisu" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    if (history.payment_method === "payment") {
      await this.accountModel.addToPlayerWallet(
        history.player_id,
        parseFloat(history.price)
      );
    }
    return history.destroy();
  }
}
