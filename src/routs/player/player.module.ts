import { Module } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { PlayerController } from "./player.controller";
import { SequelizeModule } from "@nestjs/sequelize";
import { Player } from "src/models/model/player.models";
import { PlayerDataHandlerService } from "./player-data-handler.service";
import { PlayerAccount } from "src/models/model/playerAccount.model";
import { Opponent } from "src/models/model/opponent.model";

@Module({
  imports: [SequelizeModule.forFeature([Player, PlayerAccount, Opponent])],
  providers: [PlayerService, PlayerDataHandlerService],
  controllers: [PlayerController],
  exports: [],
})
export class PlayerModule {}
