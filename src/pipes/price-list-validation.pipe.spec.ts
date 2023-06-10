import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { PriceListValidationPipe } from "./price-list-validation.pipe";

describe("Price list validation", () => {
  let pipe: PriceListValidationPipe;
  beforeEach(() => {
    pipe = new PriceListValidationPipe();
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

  it("should return a value when body is an object and doesnt have hour property", () => {
    const value = {
      notHour: "some value",
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(pipe.transform(value, metadata)).toBe(value);
  });

  it("should throw an error when metadata type is body and hour from doesnt match regexp", async () => {
    const value = {
      hours: {
        1: { from: "notValid", to: "17:00", price: "10", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });
  it("should throw an error when metadata type is body and hour to doesnt match regexp", async () => {
    const value = {
      hours: {
        1: { from: "10:00", to: "notValid", price: "10", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });
  it("should throw an error when metadata type is body and hour price doesnt match regexp", async () => {
    const value = {
      hours: {
        1: {
          from: "10:00",
          to: "17:00",
          price: "notValid",
          days: [1, 2, 3],
        },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });
  it("should throw an error when metadata type is body and hour days dont match regexp", async () => {
    const value = {
      hours: {
        1: {
          from: "10:00",
          to: "17:00",
          price: "10",
          days: [1, "notValid", 3],
        },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(() => pipe.transform(value, metadata)).toThrow(BadRequestException);
  });

  it("should return value when all conditions are met", async () => {
    const value = {
      hours: {
        0: { from: "08:00", to: "17:00", price: 10, days: [1, 2, 3] },
        1: { from: "08:00", to: "17:00", price: "10.5", days: [1, 2, 3] },
      },
    };
    const metadata: ArgumentMetadata = {
      type: "body",
    };
    expect(pipe.transform(value, metadata)).toBe(value);
  });
});
