import { Test, TestingModule } from "@nestjs/testing";
import { Response } from "express";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

describe("appController test", () => {
  let appController: AppController;
  const mockHtml = "htmlText";
  const mockAppService = {
    getIndex: jest.fn((res: Response) => {
      return mockHtml;
    }),
  };
  const mockRes = {} as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [{ provide: AppService, useValue: mockAppService }],
    }).compile();

    appController = module.get<AppController>(AppController);
  });

  describe("appController test", () => {
    it("should be define", () => {
      expect(appController).toBeDefined();
    });

    it("should return file", () => {
      expect(appController.getIndex(mockRes)).toEqual(mockHtml);
    });
  });
});
