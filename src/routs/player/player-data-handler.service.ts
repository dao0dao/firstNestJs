import { Injectable } from "@nestjs/common";

import { Player } from "src/models/model/player.models";

@Injectable()
export class PlayerDataHandlerService {
  isPlayerExist(allPlayers: Player[], name: string, surname: string) {
    const player = allPlayers.find(
      (pl) => pl.name === name && pl.surname === surname
    );
    if (!player) {
      return false;
    }
    return true;
  }
}
