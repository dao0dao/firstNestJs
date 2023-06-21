import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header(
      "Content-Security-Policy",
      "script-src 'strict-dynamic' 'unsafe-inline' http: https:; require-trusted-types-for 'script'; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; frame-src 'self'; object-src 'none'; connect-src 'self';"
    );
    res.header(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    res.header("X-Frame-Options", "DENY");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("referrer-policy", "no-referrer");
    res.header("permissions-policy", "geolocation=(none)");
    res.header("default-src", "'self'");
    res.header("style-src", ["self", "unsafe-inline", "unsafe-eval"]);
    res.header("font-src", ["self"]);
    res.header("object-src", ["none"]);
    res.header("image-src", ["self"]);
    res.removeHeader("Keep-Alive");
    next();
  }
}
