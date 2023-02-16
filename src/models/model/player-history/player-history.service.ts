import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Op } from "sequelize";
import { Player } from "../player/player.models";
import {
  CreateTimetableHistory,
  PlayerHistory,
  UpdateHistory,
} from "./playerHistory.model";

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

  getAllPlayerHistoryByTimetableId(timetable_id: number) {
    return this.history.findAll({ where: { timetable_id } });
  }

  createPlayerHistory(data: CreateTimetableHistory) {
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

  async updateOnePlayerTimetableHistory(history: UpdateHistory) {
    const model = await this.getPlayerHistoryById(history.id);
    model.update({
      timetable_id: history.timetable_id,
      player_id: history.player_id,
      player_position: history.player_position,
      service_date: history.service_date,
      service_name: history.service_name,
      price: history.price,
    });
    return model.save();
  }

  createTwoPlayerHistoryTimetable(
    history_one: CreateTimetableHistory,
    history_two: CreateTimetableHistory
  ) {
    return this.history.bulkCreate([
      {
        timetable_id: history_one.timetable_id,
        player_id: history_one.player_id,
        player_position: history_one.player_position,
        service_date: history_one.service_date,
        service_name: history_one.service_name,
        price: history_one.price,
      },
      {
        timetable_id: history_two.timetable_id,
        player_id: history_two.player_id,
        player_position: history_two.player_position,
        service_date: history_two.service_date,
        service_name: history_two.service_name,
        price: history_two.price,
      },
    ]);
  }
  updateTwoPlayerHistoryTimetable(
    history_one: UpdateHistory,
    history_two: UpdateHistory
  ) {
    return this.history.bulkCreate(
      [
        {
          id: history_one.id,
          timetable_id: history_one.timetable_id,
          player_id: history_one.player_id,
          player_position: history_one.player_position,
          service_date: history_one.service_date,
          service_name: history_one.service_name,
          price: history_one.price,
        },
        {
          id: history_two.id,
          timetable_id: history_two.timetable_id,
          player_id: history_two.player_id,
          player_position: history_two.player_position,
          service_date: history_two.service_date,
          service_name: history_two.service_name,
          price: history_two.price,
        },
      ],
      {
        updateOnDuplicate: [
          "timetable_id",
          "player_id",
          "player_position",
          "service_date",
          "service_name",
          "price",
        ],
      }
    );
  }

  removeOneTimetablePlayerHistory(
    timetable_id: number,
    player_position: number
  ) {
    return this.history.destroy({ where: { timetable_id, player_position } });
  }

  removeTwoTimetablePlayerHistory(timetable_id: number) {
    return this.history.destroy({ where: { timetable_id } });
  }
}
