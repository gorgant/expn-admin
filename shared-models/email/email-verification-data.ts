export interface EmailVerificationData {
  userId: string;
  email: string;
}

export enum EmailVerificationUrlParamKeys {
  USER_ID = 'uId',
  EMAIL = 'eId',
  IS_EMAIL_UPDATE = 'eUp'
}