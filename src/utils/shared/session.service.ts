import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Sessions } from "src/models/model/session.model";
import * as bcrypt from "bcrypt";

@Injectable()
export class SessionsService {
  constructor(@InjectModel(Sessions) private sessionModel: typeof Sessions) {}
  private toSqlDate(input: Date): string {
    let date = input.toISOString().replace("T", " ");
    date = date.slice(0, date.indexOf("."));
    return date;
  }

  async createSession(
    administrator_id: string
  ): Promise<{ key: string; date: Date }> {
    const rounds = parseInt((Math.random() * 10).toFixed(0));
    const key = await bcrypt.hash("secretKey", rounds);
    const date = new Date(Date.now() + 2 * 3600 * 1000);
    const dateSQL = this.toSqlDate(date);
    this.sessionModel
      .create({
        session_id: key,
        expired_at: dateSQL,
        administrator_id: administrator_id,
      })
      .catch((e) => console.log(e));
    return { key, date };
  }

  async findAdminIdInSession(session_id: string): Promise<string | false> {
    const session = await this.sessionModel.findOne({ where: { session_id } });
    if (!session) {
      return false;
    }
    return session.administrator_id;
  }

  async removeSession(session_id: string): Promise<boolean | Sessions> {
    const session = await this.sessionModel.findOne({ where: { session_id } });
    if (!session) {
      return false;
    }
    return session
      .destroy()
      .then(() => session)
      .catch(() => false);
  }

  clearOldSessions() {
    const now = Date.now();
    this.sessionModel.findAll().then((res) => {
      for (const ses of res) {
        const expired = new Date(ses.expired_at).getTime();
        if (now >= expired) {
          ses.destroy();
        }
      }
    });
  }
}
