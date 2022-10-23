import { IsString, ValidateIf, MaxLength, MinLength } from "class-validator";

export class AdministratorDTO {
  @IsString()
  @MaxLength(10)
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  login: string;

  @ValidateIf((c) => c.password !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  password?: string;

  @ValidateIf((c) => c.password !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  confirmPassword?: string;

  @ValidateIf((c) => c.newPassword !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  newPassword?: string;

  @ValidateIf((c) => c.newPassword !== undefined)
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  confirmNewPassword?: string;
}
