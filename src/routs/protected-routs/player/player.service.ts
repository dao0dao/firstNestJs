import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player/player.models";
import {
  OpponentOutputDTO,
  PlayerInputDTO,
  PlayerOutputDTO,
} from "./player.dto";
import { PlayerSQL } from "src/models/model/player/player.service";

interface IsPlayerExist {
  allPlayers: Player[];
  playerId?: string;
  name: string;
  surname: string;
  telephone: string;
  email: string;
}

@Injectable()
export class PlayerService {
  constructor(private playerSQL: PlayerSQL) {}

  async getAllPlayers() {
    const data = await this.playerSQL.findAllPlayers();
    const players = this.parsePlayerOpponents(data);
    return { players };
  }

  async createPlayer(data: PlayerInputDTO) {
    const allPlayers = await this.playerSQL.findAllPlayers();
    const result = this.isDoubledDataPlayerExist({
      allPlayers,
      name: data.name,
      surname: data.surname,
      telephone: data.telephone,
      email: data.email,
    });
    if ("playerNotFound" !== result) {
      return result;
    }
    const playerId = await this.playerSQL.createPlayer(data);
    if (!playerId) {
      return "serverIntervalError";
    }
    return { id: playerId };
  }

  async updatePlayer(id: string, data: PlayerInputDTO) {
    const allPlayers = await this.playerSQL.findAllPlayers();
    const condition = this.isDoubledDataPlayerExist(
      {
        allPlayers,
        playerId: id,
        name: data.name,
        surname: data.surname,
        telephone: data.telephone,
        email: data.email,
      },
      true
    );
    if ("playerNotFound" !== condition) {
      return condition;
    }
    const player = allPlayers.find((pl) => pl.id === id);
    if (!player) {
      return "playerDoNotExist";
    }
    const result = await this.playerSQL.updatePlayer(player, data);
    if (!result) {
      return "intervalServerError";
    }
    return "playerUpdated";
  }

  deletePlayer(id: string) {
    return this.playerSQL.deletePlayer(id);
  }

  private parsePlayerOpponents(data: Player[]) {
    const newPlayers: PlayerOutputDTO[] = [];
    for (const player of data) {
      const newOpponents: OpponentOutputDTO[] = [];
      for (const el of player.opponents) {
        const op = data.find((pl) => pl.id === el.opponentId);
        const newOpponent: OpponentOutputDTO = {
          id: op.id,
          name: op.name,
          surname: op.surname,
        };
        newOpponents.push(newOpponent);
      }
      const {
        account,
        id,
        name,
        surname,
        telephone,
        email,
        court,
        stringsName,
        price_list_id,
        tension,
        balls,
        weeks,
        notes,
      } = player;
      const newPlayer: PlayerOutputDTO = {
        account: account.wallet,
        id,
        name,
        surname,
        telephone,
        email,
        court,
        priceListId: price_list_id,
        stringsName,
        tension,
        balls,
        weeks,
        notes,
        opponents: newOpponents,
      };
      newPlayers.push(newPlayer);
    }
    return newPlayers;
  }

  private isDoubledDataPlayerExist(
    data: IsPlayerExist,
    isUpdatingPlayer?: boolean
  ) {
    let isPlayer = false;
    let isNumber = false;
    let isEmail = false;
    if (isUpdatingPlayer) {
      for (const pl of data.allPlayers) {
        pl.name === data.name &&
        pl.surname === data.surname &&
        pl.id !== data.playerId
          ? (isPlayer = true)
          : null;

        pl.telephone === data.telephone && pl.id !== data.playerId
          ? (isNumber = true)
          : null;

        pl.email === data.email && data.email != "" && pl.id !== data.playerId
          ? (isEmail = true)
          : null;
      }
    } else {
      for (const pl of data.allPlayers) {
        pl.name === data.name && pl.surname === data.surname
          ? (isPlayer = true)
          : null;
        pl.telephone === data.telephone ? (isNumber = true) : null;
        pl.email === data.email && data.email != "" ? (isEmail = true) : null;
      }
    }
    if (isPlayer) {
      return "playerExist";
    }
    if (isNumber) {
      return "numberExist";
    }
    if (isEmail) {
      return "emailExist";
    }
    return "playerNotFound";
  }
}
