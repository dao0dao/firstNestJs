import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable.model";
import { InputReservationDTO } from "./timetable.dto";

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable) private timetableMode: typeof Timetable
  ) {}

  findAllReservationByDate(date: string) {
    return this.timetableMode.findAll({ where: { date } });
  }

  addReservation(data: InputReservationDTO, hourCount: number) {
    const { form, layer } = data;
    return this.timetableMode.create({
      date: form.date,
      layer: layer,
      time_from: form.timeFrom,
      time_to: form.timeTo,
      court: form.court,
      player_one: form.playerOne,
      player_two: form.playerTwo,
      guest_one: form.guestOne,
      guest_two: form.guestTwo,
      hour_count: hourCount,
      is_player_one_payed: false,
      is_player_two_payed: false,
      is_first_payment: false,
    });
  }
}
