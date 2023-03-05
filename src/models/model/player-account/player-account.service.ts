import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { PlayerAccount } from "./playerAccount.model";

@Injectable()
export class PlayerAccountService {
  constructor(
    @InjectModel(PlayerAccount) private accountModel: typeof PlayerAccount
  ) {}

  getPlayerWalletById(id: string) {
    return this.accountModel.findOne({ where: { playerId: id } });
  }

  async addToPlayerWallet(playerId: string, value: number) {
    const account = await this.getPlayerWalletById(playerId);
    if (!account) {
      return false;
    }
    const newValue = value + parseFloat(account.wallet);
    account.set({ wallet: newValue });
    return account.save();
  }

  async subtractToPlayerWallet(playerId: string, value: number) {
    const account = await this.getPlayerWalletById(playerId);
    if (!account) {
      return false;
    }
    const newValue = parseFloat(account.wallet) - value;
    account.set({ wallet: newValue });
    return account.save();
  }
}
