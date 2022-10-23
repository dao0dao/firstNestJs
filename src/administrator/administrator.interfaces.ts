export interface AdministratorUpdateErrors {
  reservedLogin?: boolean;
  reservedName?: boolean;
  passwordNotMatch?: boolean;
}

export interface AdministratorCreateErrors {
  canNotCreateUser: boolean;
  passwordDoesNotMatch: boolean;
}
