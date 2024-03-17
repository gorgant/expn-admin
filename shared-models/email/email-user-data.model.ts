import { PublicUser, PublicUserKeys } from "../user/public-user.model";

// Picks spceific properties of a different interface and merges required/optionals, courtesy of https://stackoverflow.com/a/57070274/6572208
export type EmailUserData = Required<Pick<
  PublicUser, 
  PublicUserKeys.CREATED_TIMESTAMP |
  PublicUserKeys.EMAIL | 
  PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES |
  PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE |
  PublicUserKeys.EMAIL_OPT_IN_CONFIRMED |
  PublicUserKeys.EMAIL_OPT_IN_SOURCE |
  PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP | 
  PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP | 
  PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP |
  PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID |
  PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY |
  PublicUserKeys.EMAIL_VERIFIED |
  PublicUserKeys.FIRST_NAME |
  PublicUserKeys.ID |
  PublicUserKeys.LAST_MODIFIED_TIMESTAMP |
  PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT
  >>

