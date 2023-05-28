export interface LoginUserUpdateErrors {
  reservedLogin: boolean;
  reservedName: boolean;
  passwordNotMatch: boolean;
  notExist: boolean;
}

export interface UserCreateErrors {
  canNotCreateUser: boolean;
  passwordDoesNotMatch: boolean;
}
export interface UserUpdateErrors {
  id: boolean;
  name: boolean;
  reservedLogin: boolean;
  confirmNewPassword: boolean;
}
