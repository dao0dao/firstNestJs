import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerDataHandlerService } from "./player-data-handler.service";
import { ModelsModule } from "src/models/models.module";

@Module({
  imports: [ModelsModule],
  providers: [PlayerDataHandlerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
