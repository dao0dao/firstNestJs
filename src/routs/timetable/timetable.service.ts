import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Timetable } from "src/models/model/timetable.model";

@Injectable()
export class TimetableService {
  constructor(
    @InjectModel(Timetable) private timeTableMode: typeof Timetable
  ) {}

  findAllReservationByDate(date: string) {
    return this.timeTableMode.findAll({ where: { date } });
  }
}
