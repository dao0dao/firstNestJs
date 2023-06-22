import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res
      .setHeader("Content-Security-Policy", [
        "default-src 'self' 'unsafe-inline' 'https://fonts.gstatic.com'; image-src 'self'; object-src 'self'; font-src 'self' https://fonts.gstatic.com ; style-src 'self' 'unsafe-inline'; connect-src 'self'; referrer-policy 'no-referrer'",
        "X-Frame-Options 'DENY'",
        "Strict-Transport-Security 'max-age=31536000' 'includeSubDomains'",
        "X-Content-Type-Options, 'nosniff'",
      ])
      .removeHeader("Keep-Alive");
    next();
  }
}
