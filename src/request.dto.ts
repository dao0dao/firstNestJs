import { Request } from "express";

export interface RequestDTO extends Request {
  ROLE: "admin" | "login";
  ADMIN_NAME: string;
  ADMIN_ID: string;
}
