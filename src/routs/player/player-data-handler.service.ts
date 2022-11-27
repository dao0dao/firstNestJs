import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player.models";
import { OpponentOutputDTO, PlayerOutputDTO } from "./player.dto";

interface IsPlayerExist {
  allPlayers: Player[];
  playerId?: string;
  name: string;
  surname: string;
  telephone: string;
  email: string;
}

@Injectable()
export class PlayerDataHandlerService {
  parsePlayerOpponents(data: Player[]) {
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

  isPlayerExist(data: IsPlayerExist, isUpdatingPlayer?: boolean) {
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
      return { playerExist: true };
    }
    if (isNumber) {
      return { numberExist: true };
    }
    if (isEmail) {
      return { emailExist: true };
    }
    return { playerExist: false };
  }
}
