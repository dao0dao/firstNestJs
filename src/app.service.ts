import { Injectable } from "@nestjs/common";
import { frontIndexFile } from "./utils/staticFiles";
import { Response } from "express";

@Injectable()
export class AppService {
  getIndex(res: Response) {
    res.sendFile(frontIndexFile);
  }
}
