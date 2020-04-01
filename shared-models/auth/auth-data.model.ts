export enum AuthKeys {
  EMAIL = 'email',
  PASSWORD = 'password',
  NAME = 'name'
}

export interface AuthData {
  [AuthKeys.EMAIL]: string;
  [AuthKeys.PASSWORD]: string;
  [AuthKeys.NAME]?: string;
}
