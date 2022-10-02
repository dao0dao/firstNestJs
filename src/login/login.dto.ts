export class LoginInputDTO {
  nick: string;
  password: string;
}

export class LoginOutputDTO {
  isLogin: boolean;
  isAdmin: boolean;
  user: string;
}
