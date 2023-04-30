export interface LoginAdministratorUpdateErrors {
  reservedLogin?: boolean;
  reservedName?: boolean;
  passwordNotMatch?: boolean;
  notExist: boolean;
}

export interface AdministratorCreateErrors {
  canNotCreateUser: boolean;
  passwordDoesNotMatch: boolean;
}
export interface AdministratorUpdateErrors {
  id: boolean;
  name: boolean;
  reservedLogin: boolean;
  confirmNewPassword: boolean;
}
