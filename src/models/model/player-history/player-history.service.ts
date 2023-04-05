import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Player } from "../player/player.models";
import { CreateTimetableHistory, PlayerHistory } from "./playerHistory.model";

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

  createPlayerHistory(data: CreateTimetableHistory) {
    return this.history.create({
      timetable_id: data.timetable_id,
      player_id: data.player_id,
      player_position: data.player_position,
      service_date: data.service_date,
      service_name: data.service_name,
      price: data.price,
      is_paid: data.is_paid ? data.is_paid : false,
      payment_method: data.payment_method ? data.payment_method : null,
      cashier: data.cashier ? data.cashier : null,
    });
  }

  getPlayersHistoryByTimetableId(timetable_id: number) {
    return this.history.findAll({ where: { timetable_id } });
  }

  removeTwoTimetablePlayerHistory(timetable_id: number) {
    return this.history.destroy({ where: { timetable_id } });
  }

  getPriceFromPlayerHistoryByTimetableId(timetable_id: number) {
    return this.history.findAll({
      where: { timetable_id },
      attributes: ["player_position", "price", "is_paid"],
      include: [{ model: Player, attributes: ["id", "name", "surname"] }],
    });
  }

  async payForPlayerHistoryByTimetableIdAnPosition(
    timetable_id: number,
    player_position: number,
    price: number,
    payment_method: string,
    cashier: string,
    payment_date: string
  ) {
    const history = await this.history.findOne({
      where: { timetable_id, player_position },
    });
    if (!history) {
      return false;
    }
    history.set({
      is_paid: true,
      price,
      payment_method,
      cashier,
      payment_date,
    });
    return history.save();
  }

  deletePlayerHistoryById(id: string) {
    return this.history.destroy({ where: { id } });
  }
}
