import { Test } from "@nestjs/testing";
import { INestApplication, HttpStatus } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../app.module";

describe("Login (e2e)", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    app.listen(300);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it("should throw UNAUTHORIZED", async () => {
    await request(app.getHttpServer())
      .post("/api/login")
      .send({ nick: "user", password: "user" })
      .expect(HttpStatus.UNAUTHORIZED);
  });
  it("should throw UNAUTHORIZED", async () => {
    await request(app.getHttpServer())
      .get("/api/login")
      .expect("Content-Type", /json/)
      .expect(HttpStatus.UNAUTHORIZED);
  });
  it("should logIn", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/login")
      .send({ nick: "admin", password: "admin" })
      .expect(HttpStatus.CREATED);
    const cookies: string[] = response.header["set-cookie"];
    expect(cookies.some((el) => el.match(/key=/g))).toBe(true);
  });
});
