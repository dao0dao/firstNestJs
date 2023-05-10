import { Module } from "@nestjs/common";
import { PlayerController } from "./player.controller";
import { PlayerService } from "./player.service";
import { ModelsModule } from "src/models/models.module";

@Module({
  imports: [ModelsModule],
  providers: [PlayerService],
  controllers: [PlayerController],
})
export class PlayerModule {}
