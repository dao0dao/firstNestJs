import { Module } from "@nestjs/common";
import { PlayerHistoryController } from "./player-history.controller";
import { PlayerHistoryHandleDataService } from "./player-history-handle-data.service";
import { ModelsModule } from "src/models/models.module";

@Module({
  controllers: [PlayerHistoryController],
  providers: [PlayerHistoryHandleDataService],
  imports: [ModelsModule],
})
export class PlayerHistoryModule {}
