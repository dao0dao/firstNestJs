import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { InputReservationDTO } from "src/routs/protected-routs/timetable/timetable.dto";
import { Timetable } from "./timetable.model";

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable) private timetableModel: typeof Timetable
  ) {}

  findAllReservationByDate(date: string) {
    return this.timetableModel.findAll({ where: { date } });
  }

  private findOneReservationById(id: number) {
    return this.timetableModel.findOne({ where: { id } });
  }

  addReservation(data: InputReservationDTO, hourCount: number) {
    const { form, layer } = data;
    return this.timetableModel.create({
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
    const player_one = form.playerOne ? form.playerOne : "";
    const player_two = form.playerTwo ? form.playerTwo : "";
    const guest_one = form.guestOne ? form.guestOne : "";
    const guest_two = form.guestTwo ? form.guestTwo : "";
    if (
      player_one === "" &&
      player_two === "" &&
      guest_one === "" &&
      guest_two === ""
    ) {
      return null;
    }
    reservation.set({
      date: form.date,
      layer: layer,
      time_from: form.timeFrom,
      time_to: form.timeTo,
      court: form.court,
      player_one,
      player_two,
      guest_one,
      guest_two,
      hour_count: hourCount,
      is_player_one_payed: false,
      is_player_two_payed: false,
      is_first_payment: false,
    });
    return reservation.save();
  }

  deleteReservationById(id: number) {
    return this.timetableModel.destroy({ where: { id } });
  }

  async setReservationPayedForPlayerOne(reservation_id) {
    const reservation = await this.timetableModel.findOne({
      where: { id: reservation_id },
    });
    reservation.set({ is_player_one_payed: true, is_first_payment: true });
    return reservation.save();
  }

  async setReservationPayedForPlayerTwo(reservation_id) {
    const reservation = await this.timetableModel.findOne({
      where: { id: reservation_id },
    });
    reservation.set({ is_player_two_payed: true, is_first_payment: true });
    return reservation.save();
  }

  async setReservationPayedForBothPlayers(reservation_id: number) {
    const reservation = await this.timetableModel.findOne({
      where: { id: reservation_id },
    });
    reservation.set({
      is_player_one_payed: true,
      is_player_two_payed: true,
      is_first_payment: true,
    });
    return reservation.save();
  }
}
