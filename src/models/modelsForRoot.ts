import { Administrator } from "./model/administrator.model";
import { Opponent } from "./model/opponent.model";
import { Player } from "./model/player.models";
import { PlayerAccount } from "./model/playerAccount.model";
import { PriceList } from "./model/priceList.model";
import { Sessions } from "./model/session.model";
import { Timetable } from "./model/timetable.model";

export const modelsForRoot = [
  Administrator,
  Sessions,
  Player,
  Opponent,
  PlayerAccount,
  PriceList,
  Timetable,
];
