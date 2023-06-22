import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res
      .setHeader("Content-Security-Policy", [
        "default-src 'self' 'unsafe-inline'; object-src 'none'; font-src 'self' https://fonts.gstatic.com ; style-src 'self' 'unsafe-inline'; connect-src 'self'",
      ])
      .setHeader("referrer-policy", "no-referrer")
      .setHeader("image-src", "self")
      .setHeader("X-Frame-Options", "DENY")
      .setHeader("X-Content-Type-Options", "nosniff")
      .setHeader("Strict-Transport-Security", [
        "max-age=31536000",
        "includeSubDomains",
      ])
      .removeHeader("Keep-Alive");
    next();
  }
}
