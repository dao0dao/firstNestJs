import { Injectable } from "@nestjs/common";

@Injectable()
export class TimeTableHandleDataService {
  private timeToNumber(data: string) {
    const RegEx = /^\d{2}:\d{2}$/;
    if (!data.match(RegEx)) {
      return "wrong_time_formate";
    }
    const timeString = data.split(":");
    const hour = parseInt(timeString[0]);
    const minutes = parseFloat((parseInt(timeString[1]) / 60).toFixed(2));
    const timeNumber = hour + minutes;
    return timeNumber;
  }

  countTime(timeFrom: string, timeTo: string) {
    const timeStart = this.timeToNumber(timeFrom);
    const timeEnd = this.timeToNumber(timeTo);
    if (
      timeStart === "wrong_time_formate" ||
      timeEnd === "wrong_time_formate"
    ) {
      return "wrong_time_formate";
    }
    return timeEnd - timeStart;
  }
}
