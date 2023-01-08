import { Module } from "@nestjs/common";
import { PlayerHistoryModelModule } from "src/models/model/player-history/player-history.module";
import { PlayerHistoryController } from "./player-history.controller";
import { PlayerHistoryService } from "./player-history.service";

@Module({
  controllers: [PlayerHistoryController],
  providers: [PlayerHistoryService],
  imports: [PlayerHistoryModelModule],
})
export class PlayerHistoryModule {}
