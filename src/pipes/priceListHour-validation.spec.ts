import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { OptionalPriceListHourValidationPipe } from "./priceListHour-validator.pipe";

describe("Price list validation", () => {
  let pipe: OptionalPriceListHourValidationPipe;
  beforeEach(() => {
    pipe = new OptionalPriceListHourValidationPipe();
  });

  it("should return value when metadata type isn't a body", async () => {
    const value = { key: "string" };
    const metadata: ArgumentMetadata = {
      type: "custom",
    };
    const result = pipe.transform(value, metadata);
    expect(result).toBe(value);
  });

  it("should throw an error when metadata type is body and value isn't an object", async () => {
    const value = "string";
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body, value is object and doesn't include hours", async () => {
    const value = {};
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours isn't an object", async () => {
    const value = { hours: "string" };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours' keys are not valid", async () => {
    const value = { hours: { "-1": "" } };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours' data.price are not valid", async () => {
    const value = {
      hours: {
        1: { from: "08:00", to: "17:00", price: "invalid", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours' data.from are not valid", async () => {
    const value = {
      hours: {
        1: {
          from: "wrong data",
          to: "17:00",
          price: 10,
          days: [1, 2, 3],
        },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours' data.to are not valid", async () => {
    const value = {
      hours: {
        1: { from: "08:00", to: "wrong data", price: "10", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should throw an error when metadata type is body an value.hours' data.days are not valid", async () => {
    const value = {
      hours: {
        1: {
          from: "08:00",
          to: "wrong data",
          price: "10",
          days: ["wrong data"],
        },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should return a value when all conditions are met", async () => {
    const value = {
      hours: {
        0: { from: "08:00", to: "17:00", price: 10, days: [1, 2, 3] },
        1: { from: "08:00", to: "17:00", price: "10.50", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(pipe.transform(value, metadata)).toBe(value);
  });
});
