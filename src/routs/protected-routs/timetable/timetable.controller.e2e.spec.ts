import { Test } from "@nestjs/testing";
import { INestApplication, CanActivate } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "src/app.module";
import { APP_GUARD, Reflector } from "@nestjs/core";
import { AuthGuard } from "src/guards/auth.guard";
import { SessionsService } from "src/utils/shared/session.service";
import { UserSQLService } from "src/models/model/user/user-sql.service";

describe("Login (e2e)", () => {
  let app: INestApplication;
  const mockAuthGuard: CanActivate = {
    canActivate: (context) => Promise.resolve(true),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        { provide: APP_GUARD, useExisting: AuthGuard },
        AuthGuard,
        { provide: Reflector, useValue: {} },
        { provide: SessionsService, useValue: {} },
        { provide: UserSQLService, useValue: {} },
      ],
    })
      .overrideProvider(APP_GUARD)
      .useClass(mockAuthGuard)
      .compile();
    app = module.createNestApplication();
    app.listen(300);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should throw UNAUTHORIZED", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/timetable?date=2023-06-19")
      .expect("Content-Type", /json/);
    expect(response.body).toStrictEqual({ reservations: [] });
  });
});
