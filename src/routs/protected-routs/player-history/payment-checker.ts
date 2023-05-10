import { PlayerHistory } from "src/models/model/player-history/playerHistory.model";
import { RequestDTO } from "src/request.dto";
import { todaySQLDate } from "src/utils/time";
import { InputPayForHistory } from "./player-history.dto";

export function checkCanAcceptPayment(
  role: RequestDTO["ROLE"],
  data: InputPayForHistory,
  history: PlayerHistory
) {
  if ("admin" === role) {
    return true;
  }
  const today = new Date(todaySQLDate()).getTime();
  const historyDate = new Date(history.service_date).getTime();
  if (today > historyDate) {
    return false;
  }
  if (data.price && data.price !== history.price) {
    return false;
  }
  return true;
}
