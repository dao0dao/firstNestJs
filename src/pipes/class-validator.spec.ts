import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { ClassValidationPipe } from "./class-validation.pipe";
import { IsString } from "class-validator";

describe("ClassValidationPipe", () => {
  let pipe: ClassValidationPipe;

  beforeEach(() => {
    pipe = new ClassValidationPipe();
  });

  describe("transform", () => {
    it("should return the value when metatype is falsy", async () => {
      const value = "some_value";
      const argumentMetadata: ArgumentMetadata = {
        type: "body",
        metatype: undefined,
      };
      const result = await pipe.transform(value, argumentMetadata);
      expect(result).toBe(value);
    });

    it("should return the value when metatype doesn't require validation", async () => {
      const value = true;
      const argumentMetadata: ArgumentMetadata = {
        type: "body",
        metatype: Boolean,
      };
      const result = await pipe.transform(value, argumentMetadata);
      expect(result).toEqual(value);
    });

    it("should throw BadRequestException when validation fails", async () => {
      const value = { value: undefined };
      class metaType {
        @IsString()
        value: string;
      }
      const argumentMetadata: ArgumentMetadata = {
        type: "body",
        metatype: metaType,
        data: undefined,
      };
      await expect(pipe.transform(value, argumentMetadata)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  //   describe("toValidate", () => {
  //     it("should return false for String, Boolean, Number, Array, and Object types", () => {
  //       const types = [String, Boolean, Number, Array, Object];
  //       types.forEach((type) => {
  //         const result = pipe["toValidate"](type);
  //         expect(result).toBe(false);
  //       });
  //     });

  //     it("should return true for custom types", () => {
  //       class CustomType {}
  //       const result = pipe["toValidate"](CustomType);
  //       expect(result).toBe(true);
  //     });
  //   });
});
