import { IsString } from "class-validator";

export class LoginInputDTO {
  @IsString() nick: string;
  @IsString() password: string;
}

export class LoginResponse {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
  user_id?: string;
}
