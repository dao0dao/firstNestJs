import { IsString, MaxLength } from "class-validator";

export class LoginInputDTO {
  @IsString()
  @MaxLength(15)
  nick: string;

  @IsString()
  @MaxLength(15)
  password: string;
}

export class LoginResponse {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
  user_id?: string;
}
