import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class HeadersMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.header(
      "Content-Security-Policy",
      "script-src 'strict-dynamic' 'unsafe-inline' http: https:; require-trusted-types-for 'script'; default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; frame-src 'self'; object-src 'none'; connect-src 'self';"
    );
    res.removeHeader("Keep-Alive");
    next();
  }
}
