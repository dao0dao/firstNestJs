import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Param,
  Delete,
} from "@nestjs/common";
import { PlayerService } from "./player.service";
import { Role } from "src/guards/roles.decorators";
import { PlayerIdParamDTO, PlayerInputDTO } from "./player.dto";
import { PlayerDataHandlerService } from "./player-data-handler.service";

@Controller("players")
export class PlayerController {
  constructor(
    private playerService: PlayerService,
    private dataHandler: PlayerDataHandlerService
  ) {}

  @Get()
  @Role("login")
  async getAllPayers() {
    const data = await this.playerService.findAllPlayers();
    const players = this.dataHandler.parsePlayerOpponents(data);
    return { players };
  }
  @Post("add")
  @Role("login")
  async addPlayer(@Body() body: PlayerInputDTO) {
    const allPlayers = await this.playerService.findAllPlayers();
    const condition = this.dataHandler.isPlayerExist({
      allPlayers,
      name: body.name,
      surname: body.surname,
      telephone: body.telephone,
      email: body.email,
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
    } else if (condition.emailExist) {
      throw new HttpException(
        { reason: "Taki email już istnieje" },
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

  @Post("update/:id")
  @Role("admin")
  async updatePlayer(
    @Param() Query: PlayerIdParamDTO,
    @Body() body: PlayerInputDTO
  ) {
    const allPlayers = await this.playerService.findAllPlayers();
    const condition = this.dataHandler.isPlayerExist(
      {
        allPlayers,
        playerId: Query.id,
        name: body.name,
        surname: body.surname,
        telephone: body.telephone,
        email: body.email,
      },
      true
    );
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
    } else if (condition.emailExist) {
      throw new HttpException(
        { reason: "Taki email już istnieje" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const player = allPlayers.find((pl) => pl.id === Query.id);
    if (!player) {
      throw new HttpException(
        { reason: "Brak gracza w bazie danych" },
        HttpStatus.NOT_ACCEPTABLE
      );
    }
    const result = await this.playerService.updatePlayer(player, body);
    if (!result) {
      throw new HttpException(
        { readWrite: "fail" },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { updated: true };
  }

  @Delete("delete/:id")
  @Role("admin")
  async deletePlayer(@Param() Query: PlayerIdParamDTO) {
    const result = await this.playerService.deletePlayer(Query.id);
    return { deleted: result };
  }
}
