import { User } from "./model/user/user.model";
import { Opponent } from "./model/opponent.model";
import { PlayerHistory } from "./model/player-history/playerHistory.model";
import { Player } from "./model/player/player.models";
import { PlayerAccount } from "./model/player-account/playerAccount.model";
import { PriceList } from "./model/price-list/priceList.model";
import { Sessions } from "./model/session.model";
import { Timetable } from "./model/timetable/timetable.model";
import { UserServices } from "./model/user-servicec/user-services.model";

export const mysqlTables = [
  User,
  Sessions,
  Player,
  Opponent,
  PlayerAccount,
  PriceList,
  Timetable,
  PlayerHistory,
  UserServices,
];
