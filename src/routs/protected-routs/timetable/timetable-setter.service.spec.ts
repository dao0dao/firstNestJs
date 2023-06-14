import { Test, TestingModule } from "@nestjs/testing";
import { TimetableSetterService } from "./timetable-setter.service";
import { PlayerSQL } from "src/models/model/player/player.service";

describe("test timetable setter service", () => {
  let service: TimetableSetterService;

  const mockPlayerService = {
    getPlayerPriceListIdByPlayerId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: PlayerSQL,
          useValue: mockPlayerService,
        },
        TimetableSetterService,
      ],
    }).compile();
    service = module.get<TimetableSetterService>(TimetableSetterService);
  });

  it("should count players", () => {
    const mockData = { player_one: "one" } as any;
    expect(service.setPlayersCount(mockData)).toBe(1);
    mockData.player_two = "two";
    expect(service.setPlayersCount(mockData)).toBe(2);
    mockData.guest_one = "one";
    expect(service.setPlayersCount(mockData)).toBe(3);
    mockData.guest_two = "two";
    expect(service.setPlayersCount(mockData)).toBe(4);
  });

  describe("test setPlayerPrice", () => {
    it("should return 0 if priceList is undefined", () => {
      const mockData = {} as any;
      expect(service["setPlayerPrice"](mockData)).toBe(0);
    });

    it("should return default price when hours length is undefined", () => {
      const mockData = {
        priceList: {
          hours: [],
          default_Price: 20,
        },
        hourCount: 2,
        playerCount: 1,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(40);
    });

    it("should return default price when time from is invalid", () => {
      const mockData = {
        date: "2023-06-14",
        time_from: "invalid",
        time_to: "12:00",
        priceList: {
          default_Price: 20,
          hours: {
            1: {
              days: [1, 2, 3, 4, 5],
              from: "09:00",
              to: "18:00",
              price: 15,
            },
            2: {
              days: [6, 7],
              from: "10:00",
              to: "14:00",
              price: 20,
            },
          },
        },
        playerCount: 1,
        hourCount: 2,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(40);
    });

    it("should return default price when time to is invalid", () => {
      const mockData = {
        date: "2023-06-14",
        time_from: "10:00",
        time_to: "",
        priceList: {
          default_Price: 20,
          hours: {
            1: {
              days: [1, 2, 3, 4, 5],
              from: "09:00",
              to: "18:00",
              price: 15,
            },
            2: {
              days: [6, 7],
              from: "10:00",
              to: "14:00",
              price: 20,
            },
          },
        },
        playerCount: 1,
        hourCount: 2,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(40);
    });

    it("should return default price when hour from is invalid", () => {
      const mockData = {
        date: "2023-06-14",
        time_from: "10:00",
        time_to: "14:00",
        priceList: {
          default_Price: 20,
          hours: {
            1: {
              days: [1, 2, 3, 4, 5],
              from: "",
              to: "18:00",
              price: 15,
            },
            2: {
              days: [6, 7],
              from: "10:00",
              to: "14:00",
              price: 20,
            },
          },
        },
        playerCount: 1,
        hourCount: 2,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(40);
    });

    it("should return default price when hour to is invalid", () => {
      const mockData = {
        date: "2023-06-12",
        time_from: "10:00",
        time_to: "14:00",
        priceList: {
          default_Price: 20,
          hours: {
            1: {
              days: [1, 2, 3, 4, 5],
              from: "14:00",
              to: "18:00",
              price: 15,
            },
            2: {
              days: [6, 7],
              from: "10:00",
              to: "",
              price: 20,
            },
          },
        },
        playerCount: 1,
        hourCount: 2,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(40);
    });

    it("should calculate price when all conditions are met", () => {
      const mockData = {
        date: "2023-06-12",
        time_from: "11:00",
        time_to: "13:00",
        priceList: {
          default_Price: 20,
          hours: {
            1: {
              days: [1, 2, 3, 4, 5],
              from: "12:00",
              to: "18:00",
              price: 30,
            },
          },
        },
        playerCount: 1,
        hourCount: 2,
      } as any;
      expect(service["setPlayerPrice"](mockData)).toBe(50);
    });
  });
});
