import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InputReservationDTO } from "src/routs/protected-routs/timetable/timetable.dto";
import { Timetable } from "./timetable.model";

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable) private timetableMode: typeof Timetable
  ) {}

  findAllReservationByDate(date: string) {
    return this.timetableMode.findAll({ where: { date } });
  }

  private findOneReservationById(id: number) {
    return this.timetableMode.findOne({ where: { id } });
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

  async updateReservation(data: InputReservationDTO, hourCount: number) {
    const { form, layer, id } = data;
    const reservation = await this.findOneReservationById(id);
    if (!reservation) {
      return null;
    }
    reservation.set({
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
    return reservation.save();
  }

  deleteReservationById(id: number) {
    return this.timetableMode.destroy({ where: { id } });
  }
}
