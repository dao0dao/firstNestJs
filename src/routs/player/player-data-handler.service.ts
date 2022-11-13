import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player.models";

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
