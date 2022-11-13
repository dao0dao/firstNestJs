import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { Role } from "src/guards/roles.decorators";
import { PlayerInputDTO } from "./player.dto";
import { PlayerDataHandlerService } from "./player-data-handler.service";

@Controller("players")
@Role("login")
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private dataHandler: PlayerDataHandlerService
  ) {}

  @Get()
  async getAllPayers() {
    const players = await this.playerService.findAllPlayers();
    return { players };
  }
  @Post("add")
  async addPlayer(@Body() body: PlayerInputDTO) {
    const allPlayers = await this.playerService.findAllPlayers();
    const condition = this.dataHandler.isPlayerExist({
      allPlayers,
      name: body.name,
      surname: body.surname,
      telephone: body.telephone,
    });
    if (condition.playerExist) {
      throw new HttpException(
        { reason: "Taki gracz istniej" },
        HttpStatus.NOT_ACCEPTABLE
      );
    } else if (condition.numberExist) {
      throw new HttpException(
        { reason: "Taki numer kom. już istnieje" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const playerId = await this.playerService.createPlayer(body);
    if (!playerId) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { id: playerId };
  }
}
