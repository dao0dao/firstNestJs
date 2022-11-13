import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Opponent } from "src/models/model/opponent.model";
import { Player } from "src/models/model/player.models";
import { PlayerAccount } from "src/models/model/playerAccount.model";
import { PlayerInputDTO } from "./player.dto";

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player) private playerModel: typeof Player,
    @InjectModel(PlayerAccount) private accountMode: typeof PlayerAccount,
    @InjectModel(Opponent) private opponentModel: typeof Opponent
  ) {}

  findAllPlayers() {
    return this.playerModel.findAll({ include: ["opponents"] });
  }

  async createPlayer(body: PlayerInputDTO) {
    const {
      account,
      balls,
      court,
      email,
      name,
      notes,
      priceListId,
      opponents,
      stringsName,
      surname,
      telephone,
      tension,
      weeks,
    } = body;
    const player = await this.playerModel.create({
      balls,
      court,
      email,
      name,
      notes,
      priceListId,
      stringsName,
      surname,
      telephone,
      tension,
      weeks: JSON.stringify(weeks),
    });
    if (!player) {
      return false;
    }
    const wallet = await this.accountMode.create({
      wallet: account,
      playerId: player.id,
    });
    if (!wallet) {
      await player.destroy();
      return false;
    }
    const allOpponents = [];
    for (const op of opponents) {
      allOpponents.push({ playerId: player.id, opponentId: op.id });
    }
    if (allOpponents.length) {
      this.opponentModel.bulkCreate(allOpponents, {
        validate: true,
      });
    }
    return player.id;
  }

  async updatePlayer(player: Player, body: PlayerInputDTO) {
    const {
      balls,
      court,
      email,
      name,
      notes,
      priceListId,
      opponents,
      stringsName,
      surname,
      telephone,
      tension,
      weeks,
    } = body;
    player.set({
      balls,
      court,
      email,
      name,
      notes,
      priceListId,
      stringsName,
      surname,
      telephone,
      tension,
      weeks: JSON.stringify(weeks),
    });
    const oldOpponents = await this.opponentModel.findAll({
      where: { playerId: player.id },
    });
    // usuwanie nieaktualnych przeciwników
    for (const oldOp of oldOpponents) {
      const isExist = opponents.find((op) => op.id === oldOp.opponentId);
      if (!isExist) {
        oldOp.destroy();
      }
    }
    // dodawanie nowych przeciwników
    const newOpponents = [];
    for (const newOp of opponents) {
      const isExist = oldOpponents.find(
        (oldOp) => oldOp.opponentId === newOp.id
      );
      if (!isExist) {
        newOpponents.push({ playerId: player.id, opponentId: newOp.id });
      }
    }
    if (newOpponents.length > 0) {
      this.opponentModel.bulkCreate(newOpponents, {
        validate: true,
      });
    }
    return player.save();
  }
}
