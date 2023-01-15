import { Module } from "@nestjs/common";
import { PlayerHistoryModelModule } from "src/models/model/player-history/player-history.module";
import { PlayerHistoryController } from "./player-history.controller";
import { PlayerHistoryHandleDataService } from "./player-history-handle-data.service";

@Module({
  controllers: [PlayerHistoryController],
  providers: [PlayerHistoryHandleDataService],
  imports: [PlayerHistoryModelModule],
})
export class PlayerHistoryModule {}
