import { SubscriberData } from "../email/subscriber-data.model";

export enum ContactFormKeys {
  CREATED_TIMESTAMP = 'createdTimestamp',
  ID = 'id',
  MESSAGE = 'message',
  OPT_IN = 'optIn',
  SUBSCRIBER_DATA = 'subscriberData'
}

export interface ContactForm {
  [ContactFormKeys.MESSAGE]: string;
  [ContactFormKeys.OPT_IN]: boolean;
  [ContactFormKeys.SUBSCRIBER_DATA]: SubscriberData;
}

export const CONTACT_FORM_VARS = {
  messageMaxLength: 1000,
  messageMinLength: 20,
}
