import * as bcrypt from "bcrypt";
const saltRounds = 13;

export const isSamePasswords = (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const createPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, saltRounds);
};
