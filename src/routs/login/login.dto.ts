import { IsString, MaxLength } from "class-validator";

export class LoginInputDTO {
  @IsString()
  @MaxLength(15)
  nick: string;

  @IsString()
  @MaxLength(15)
  password: string;
}

export interface User {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
  user_id?: string;
}
