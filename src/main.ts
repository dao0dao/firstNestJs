import { NestFactory } from "@nestjs/core";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  if (process.env.MODE === "dev") {
    app.enableCors({
      origin: ["http://localhost:4200", "http://localhost:3000"],
      credentials: true,
    });
  }
  await app.listen(process.env.PORT);
}
bootstrap();
