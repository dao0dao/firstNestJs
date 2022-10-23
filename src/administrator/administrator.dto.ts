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

  @ValidateIf((c) => c.newPassword != "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  newPassword?: string;

  @ValidateIf((c) => c.newPassword != "")
  @IsString()
  @MaxLength(10)
  @MinLength(5)
  confirmNewPassword?: string;
}
