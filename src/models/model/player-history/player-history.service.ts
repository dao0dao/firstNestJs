import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Player } from "../player.models";
import { PlayerHistory } from "./playerHistory.model";

@Injectable()
export class PlayerHistoryModelService {
  constructor(
    @InjectModel(PlayerHistory) private history: typeof PlayerHistory
  ) {}

  getPlayerHistoryByDate(player_id: string, dateTo: string, dateFrom?: string) {
    return this.history.findAll({
      where: {
        player_id,
        service_date: {
          [Op.between]: [dateFrom, dateTo],
        },
      },
      include: [{ model: Player, attributes: ["name", "surname"] }],
    });
  }
}
