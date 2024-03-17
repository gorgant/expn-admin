import { EmailUserData } from "./email-user-data.model";

export interface SgCreateOrUpdateContactData {
  emailUserData: EmailUserData,
  isNewContact: boolean
  isEmailUpdate?: boolean;
}