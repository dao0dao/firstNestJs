import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { PlayerInputDTO } from "src/routs/protected-routs/player/player.dto";
import { Opponent } from "../opponent.model";
import { PlayerAccount } from "../player-account/playerAccount.model";
import { Player } from "./player.models";

@Injectable()
export class PlayerSQL {
  constructor(
    @InjectModel(Player) private playerModel: typeof Player,
    @InjectModel(PlayerAccount) private accountMode: typeof PlayerAccount,
    @InjectModel(Opponent) private opponentModel: typeof Opponent
  ) {}

  findAllPlayers() {
    return this.playerModel.findAll({
      include: [Opponent, PlayerAccount],
    });
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
      price_list_id: priceListId,
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
      price_list_id: priceListId,
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
      await this.opponentModel.bulkCreate(newOpponents, {
        validate: true,
      });
    }
    return player.save();
  }

  async deletePlayer(playerId: string) {
    const player = await this.playerModel.findOne({ where: { id: playerId } });
    await this.opponentModel.destroy({
      where: {
        [Op.or]: [{ opponentId: playerId }],
      },
    });
    await player.destroy();
    return true;
  }

  async clearPlayerPriceListById(id: string) {
    const players = await this.playerModel.findAll({
      where: { price_list_id: id },
    });
    for (const player of players) {
      player.set({ price_list_id: "" });
      player.save();
    }
  }

  getPlayerPriceListIdByPlayerId(player_id: string) {
    return this.playerModel
      .findOne({
        where: { id: player_id },
        attributes: ["price_list_id"],
      })
      .then((pl) => pl.price_list_id);
  }
}
