export function timeToNumber(data: string) {
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

export function countFromToTime(timeFrom: string, timeTo: string) {
  const timeStart = this.timeToNumber(timeFrom);
  const timeEnd = this.timeToNumber(timeTo);
  let timeEndNumber = 0;
  if (timeStart === "wrong_time_formate" || timeEnd === "wrong_time_formate") {
    return "wrong_time_formate";
  }
  if (timeEnd === 0) {
    timeEndNumber = 24;
  } else {
    timeEndNumber = timeEnd;
  }

  return timeEndNumber - timeStart;
}
