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
import { Role } from "src/guards/roles.decorators";
import { PlayerIdParamDTO, PlayerInputDTO } from "./player.dto";
import { PlayerService } from "./player.service";

@Controller("players")
export class PlayerController {
  constructor(private playerService: PlayerService) {}

  @Get()
  @Role("login")
  async getAllPayers() {
    const players = await this.playerService.getAllPlayers();
    return { players };
  }
  @Post("add")
  @Role("login")
  async addPlayer(@Body() body: PlayerInputDTO) {
    const result = await this.playerService.createPlayer(body);
    switch (result) {
      case "playerExist":
        throw new HttpException(
          { reason: "Taki gracz istniej" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "numberExist":
        throw new HttpException(
          { reason: "Taki numer kom. już istnieje" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "emailExist":
        throw new HttpException(
          { reason: "Taki email już istnieje" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "serverIntervalError":
        throw new HttpException(
          { readWrite: "fail" },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
    }
    return { id: result };
  }

  @Post("update/:id")
  @Role("admin")
  async updatePlayer(
    @Param() Query: PlayerIdParamDTO,
    @Body() body: PlayerInputDTO
  ) {
    const result = await this.playerService.updatePlayer(Query.id, body);
    switch (result) {
      case "playerExist":
        throw new HttpException(
          { reason: "Taki gracz istniej" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "numberExist":
        throw new HttpException(
          { reason: "Taki numer kom. już istnieje" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "emailExist":
        throw new HttpException(
          { reason: "Taki email już istnieje" },
          HttpStatus.NOT_ACCEPTABLE
        );
      case "intervalServerError":
        throw new HttpException(
          { readWrite: "fail" },
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      case "playerDoNotExist":
        throw new HttpException(
          { reason: "Brak gracza w bazie danych" },
          HttpStatus.NOT_ACCEPTABLE
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
