import { Module } from "@nestjs/common";
import { ModelsModule } from "src/models/models.module";
import { DebtorController } from "./debtor.controller";
import { DebtorService } from "./debtor.service";

@Module({
  controllers: [DebtorController],
  providers: [DebtorService],
  imports: [ModelsModule],
})
export class DebtorModule {}
