import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res
      .setHeader(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
      )
      .setHeader("X-Frame-Options", "DENY")
      .setHeader("X-Content-Type-Options", "nosniff")
      .setHeader("referrer-policy", "no-referrer")
      .setHeader("permissions-policy", "geolocation=(none)")
      .setHeader("default-src", "'self'")
      .setHeader("style-src", ["self", "unsafe-inline", "unsafe-eval"])
      .setHeader("font-src", ["self"])
      .setHeader("object-src", ["none"])
      .setHeader("image-src", ["self"])
      .setHeader("script-src", ["self"])
      .removeHeader("Keep-Alive");
    next();
  }
}
