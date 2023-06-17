import { Test } from "@nestjs/testing";
import { AppModule } from "./app.module";
import { INestApplication, HttpStatus } from "@nestjs/common";
import { AppService } from "./app.service";
import * as request from "supertest";
import { Response } from "express";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let appService: AppService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    appService = module.get<AppService>(AppService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return the index file", async () => {
    const mockResponse = "some index file";
    jest.spyOn(appService, "getIndex").mockImplementation((res: Response) => {
      res.send(mockResponse);
    });

    const response = await request(app.getHttpServer())
      .get("/")
      .expect(HttpStatus.OK);
    expect(response.text).toBe(mockResponse);
  });
});
