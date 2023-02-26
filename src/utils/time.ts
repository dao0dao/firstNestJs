export function timeToNumber(time: string) {
  const RegEx = /^\d{2}:\d{2}$/;
  if (!time.match(RegEx)) {
    return "wrong_time_formate";
  }
  const timeString = time.split(":");
  const hour = parseInt(timeString[0]);
  const minutes = parseFloat((parseInt(timeString[1]) / 60).toFixed(2));
  const timeNumber = hour + minutes;
  return timeNumber;
}

export function countFromToTime(timeFrom: string, timeTo: string) {
  const timeStart = timeToNumber(timeFrom);
  const timeEnd = timeToNumber(timeTo);
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

export function todaySQLDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  let day: string | number = date.getDate();
  if (day < 9) {
    day = "0" + day;
  }
  return year + "-" + month + "-" + day;
}
