import { Injectable } from "@nestjs/common";
import { PlayerAccountSQL } from "src/models/model/player-account/player-account.service";
import { DebtorDTO } from "./debtor.model";

@Injectable()
export class DebtorService {
  constructor(private accountModel: PlayerAccountSQL) {}

  async getDebtors() {
    const debtorsList: DebtorDTO[] = [];
    const data = await this.accountModel.getDebtors();
    for (const el of data) {
      debtorsList.push({
        email: el.player.email,
        name: el.player.name,
        surname: el.player.surname,
        telephone: el.player.telephone,
        wallet: el.wallet,
      });
    }
    return debtorsList;
  }
}
