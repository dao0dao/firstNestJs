import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Player } from "../player/player.models";
import { History, PaidHistory, PlayerHistory } from "./playerHistory.model";

@Injectable()
export class PlayerHistoryModelService {
  constructor(
    @InjectModel(PlayerHistory) private history: typeof PlayerHistory
  ) {}

  getPlayerHistoryById(id: number) {
    return this.history.findOne({ where: { id } });
  }

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
  createPlayerHistory(data: History) {
    return this.history.create({
      timetable_id: data.timetable_id,
      player_id: data.player_id,
      player_position: data.player_position,
      service_date: data.service_date,
      service_name: data.service_name,
      price: data.price,
      is_paid: false,
    });
  }

  async paidForService(data: PaidHistory) {
    const history = await this.getPlayerHistoryById(data.id);
    if (!history) {
      return false;
    }
    history.set({
      payment_method: data.payment_method,
      payment_date: data.payment_date,
      cashier: data.cashier,
    });
    return history.save();
  }
}
