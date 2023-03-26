import { Controller, Get } from "@nestjs/common";
import { Role } from "src/guards/roles.decorators";
import { DebtorService } from "./debtor.service";

@Controller("debtor")
export class DebtorController {
  constructor(private debtorService: DebtorService) {}

  @Get()
  @Role("login")
  getDebtorsList() {
    return this.debtorService.getDebtors();
  }
}
