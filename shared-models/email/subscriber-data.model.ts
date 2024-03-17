import { PublicUserKeys } from "../user/public-user.model";
import { EmailUserData } from "./email-user-data.model";

export type SubscriberData = Required<Pick<
  EmailUserData,
  PublicUserKeys.EMAIL |
  PublicUserKeys.FIRST_NAME |
  PublicUserKeys.EMAIL_OPT_IN_SOURCE
>>

export const LOCAL_STORAGE_SUBSCRIBER_DATA_KEY = 'subscriberData';


export enum PopupTriggerQueryParamKeys {
  SMALL_TALK = 'smallTalk'
}