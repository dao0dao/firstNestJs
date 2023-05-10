import { Module } from "@nestjs/common";
import { PlayerHistoryController } from "./player-history.controller";
import { PlayerHistoryService } from "./player-history.service";
import { ModelsModule } from "src/models/models.module";

@Module({
  controllers: [PlayerHistoryController],
  providers: [PlayerHistoryService],
  imports: [ModelsModule],
})
export class PlayerHistoryModule {}
