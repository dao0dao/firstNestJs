import { Injectable } from "@nestjs/common";
import { Player } from "src/models/model/player.models";

interface IsPlayerExist {
  allPlayers: Player[];
  name: string;
  surname: string;
  telephone: string;
}

@Injectable()
export class PlayerDataHandlerService {
  isPlayerExist(data: IsPlayerExist) {
    let isPlayer = false;
    let isNumber = false;
    for (const pl of data.allPlayers) {
      pl.name === data.name && pl.surname === data.surname
        ? (isPlayer = true)
        : null;
      pl.telephone === data.telephone ? (isNumber = true) : null;
    }
    if (isPlayer) {
      return { playerExist: true };
    }
    if (isNumber) {
      return { numberExist: true };
    }
    return { playerExist: false };
  }
}
