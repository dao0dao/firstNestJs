import { Administrator } from "./model/administrator.model";
import { Opponent } from "./model/opponent.model";
import { PlayerHistory } from "./model/player-history/playerHistory.model";
import { Player } from "./model/player/player.models";
import { PlayerAccount } from "./model/player-account/playerAccount.model";
import { PriceList } from "./model/price-list/priceList.model";
import { Sessions } from "./model/session.model";
import { Timetable } from "./model/timetable/timetable.model";

export const modelsForRoot = [
  Administrator,
  Sessions,
  Player,
  Opponent,
  PlayerAccount,
  PriceList,
  Timetable,
  PlayerHistory,
];
