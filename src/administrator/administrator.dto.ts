import {
  IsString,
  ValidateIf,
  MaxLength,
  MinLength,
  IsUUID,
} from "class-validator";

export class AdministratorDTO {
  @ValidateIf((c) => c.id !== undefined)
  @IsUUID()
  id: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  name: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  login: string;

  @ValidateIf((c) => c.password !== undefined && c.password !== "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  password?: string;

  @ValidateIf((c) => c.password !== undefined && c.password !== "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  confirmPassword?: string;

  @ValidateIf((c) => c.newPassword !== undefined && c.newPassword !== "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  newPassword?: string;

  @ValidateIf((c) => c.newPassword !== undefined && c.newPassword !== "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  confirmNewPassword?: string;
}
