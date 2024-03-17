import { EmailOptInSource } from "../email/email-opt-in-source.model";
import { SendgridContactListId } from "../email/email-vars.model";
import { UnsubscribeRecordList, UnsubscribeRecord } from "../email/unsubscribe-record.model";
import { Timestamp } from '@angular/fire/firestore';
import { GoogleCloudFunctionsTimestamp } from "../firestore/google-cloud-functions-timestamp.model";

export interface GoogleCloudFunctionsPublicUser extends PublicUser {
  [PublicUserKeys.CREATED_TIMESTAMP]: GoogleCloudFunctionsTimestamp;
  [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: GoogleCloudFunctionsTimestamp | undefined;
  [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: GoogleCloudFunctionsTimestamp | undefined | null;
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: GoogleCloudFunctionsTimestamp | undefined | null;
  [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: GoogleCloudFunctionsTimestamp;
}

export interface PublicUser {
  [PublicUserKeys.CREATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PublicUserKeys.EMAIL]: string;
  [PublicUserKeys.EMAIL_GROUP_UNSUBSCRIBES]: UnsubscribeRecordList | undefined | null;
  [PublicUserKeys.EMAIL_GLOBAL_UNSUBSCRIBE]: UnsubscribeRecord | undefined | null;
  [PublicUserKeys.EMAIL_OPT_IN_SOURCE]: EmailOptInSource | undefined,
  [PublicUserKeys.EMAIL_OPT_IN_CONFIRMED]: boolean;
  [PublicUserKeys.EMAIL_OPT_IN_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | undefined | null;
  [PublicUserKeys.EMAIL_OPT_OUT_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | undefined | null;
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp | undefined | null;
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_ID]: string | undefined | null;
  [PublicUserKeys.EMAIL_SENDGRID_CONTACT_LIST_ARRAY]: SendgridContactListId[] | undefined | null;
  [PublicUserKeys.EMAIL_VERIFIED]: boolean | undefined;
  [PublicUserKeys.FIRST_NAME]: string;
  [PublicUserKeys.ID]: string;
  [PublicUserKeys.LAST_MODIFIED_TIMESTAMP]: number | Timestamp | GoogleCloudFunctionsTimestamp;
  [PublicUserKeys.ONBOARDING_WELCOME_EMAIL_SENT]: boolean | undefined;
}

export enum PublicUserKeys {
  CREATED_TIMESTAMP = 'createdTimestamp',
  EMAIL = 'email',
  EMAIL_GROUP_UNSUBSCRIBES = 'emailGroupUnsubscribes',
  EMAIL_GLOBAL_UNSUBSCRIBE = 'emailGlobalUnsubscribe',
  EMAIL_OPT_IN_SOURCE = 'emailOptInSource',
  EMAIL_OPT_IN_TIMESTAMP = 'emailOptInTimestamp',
  EMAIL_OPT_IN_CONFIRMED = 'emailOptInConfirmed',
  EMAIL_OPT_OUT_TIMESTAMP = 'emailOptOutTimestamp',
  EMAIL_SENDGRID_CONTACT_CREATED_TIMESTAMP = 'emailSendgridContactCreatedTimestamp',
  EMAIL_SENDGRID_CONTACT_ID = 'emailSendgridContactId',
  EMAIL_SENDGRID_CONTACT_LIST_ARRAY = 'emailSendgridContactListArray',
  EMAIL_VERIFIED = 'emailVerified',
  FIRST_NAME = 'firstName',
  ID = 'id',
  LAST_MODIFIED_TIMESTAMP = 'lastModifiedTimestamp',
  ONBOARDING_WELCOME_EMAIL_SENT = 'onboardingWelcomeEmailSent',
}

export const PUBLIC_USER_VARS = {
  emailMinLength: 5,
  emailMaxLength: 50,
  firstNameMinLength: 2,
  firstNameMaxLength: 25
};







export enum OldSubscriptionSource {
  WEBSITE_BOX = 'website-box',
  POPUP_SMALLTALK = 'popup-smalltalk',
  CHECKOUT = 'checkout',
  CONTACT_FORM = 'contact-form',
  CONTACT_FORM_NO_SUB = 'contact-form-no-sub',
  WAIT_LIST_EXECUTIVE_PRESENCE = 'wait-list-executive-presence',
  WAIT_LIST_REMOTE_WORK = 'wait-list-remote-work'
}

export interface OldSubSourceProductIdReference {
  subSource: OldSubscriptionSource;
  productId: string;
}

export interface OldSubSourceProductIdReferenceList {
  [key: string]: OldSubSourceProductIdReference;
}


export enum OldEmailSubscriberKeys {
  SUBSCRIPTION_SOURCES = 'subscriptionSources',
  MODIFIED_DATE = 'modifiedDate',
  CREATED_DATE = 'createdDate',
  OPT_IN_CONFIRMED = 'optInConfirmed',
  OPT_IN_TIMESTAMP = 'optInTimestamp'
}


export enum OldBillingKeys {
  FIRST_NAME = 'firstName',
  LAST_NAME = 'lastName',
  EMAIL = 'email',
  PHONE = 'phone',
  BILLING_ONE = 'billingOne',
  BILLING_TWO = 'billingTwo',
  CITY = 'city',
  STATE = 'state',
  US_STATE_CODE = 'usStateCode',
  POSTAL_CODE = 'postalCode',
  COUNTRY = 'country',
  COUNTRY_CODE = 'countryCode'
}

export interface OldBillingDetails {
  [OldBillingKeys.FIRST_NAME]: string;
  [OldBillingKeys.LAST_NAME]: string;
  [OldBillingKeys.EMAIL]: string;
  [OldBillingKeys.PHONE]: string;
  [OldBillingKeys.BILLING_ONE]: string;
  [OldBillingKeys.BILLING_TWO]: string;
  [OldBillingKeys.CITY]: string;
  [OldBillingKeys.STATE]: string;
  [OldBillingKeys.US_STATE_CODE]: string;
  [OldBillingKeys.POSTAL_CODE]: string;
  [OldBillingKeys.COUNTRY]: string;
  [OldBillingKeys.COUNTRY_CODE]: string;
}

export interface OldOrderHistory {
  [stripeChargeId: string]: OldOrder;
}

export interface OldOrder {
  id: string;
  orderNumber: string; // A subset of id
  createdDate: number;
  stripeChargeId: string;
  stripeCustomerId: string;
  firstName: string;
  lastName: string;
  email: string;
  publicUser: OldPublicUser;
  productId: string;
  listPrice: number;
  discountCouponCode: string;
  amountPaid: number;
  status: 'activated' | 'inactive';
}

export interface OldPublicUser {
  id: string;
  lastAuthenticated: number;
  modifiedDate: number;
  createdDate?: number;
  billingDetails?: OldBillingDetails | Partial<OldBillingDetails>;
  stripeCustomerId?: string;
  orderHistory?: OldOrderHistory;
  optInConfirmed?: boolean;
}

export interface OldEmailSubscriber {
  id: string; // email address of user
  publicUserData: OldPublicUser;
  [OldEmailSubscriberKeys.CREATED_DATE]: number;
  [OldEmailSubscriberKeys.MODIFIED_DATE]: number;
  lastSubSource: OldSubscriptionSource;
  [OldEmailSubscriberKeys.SUBSCRIPTION_SOURCES]: OldSubscriptionSource[];
  introEmailSent?: boolean;
  groupUnsubscribes?: UnsubscribeRecordList;
  globalUnsubscribe?: UnsubscribeRecord;
  [OldEmailSubscriberKeys.OPT_IN_CONFIRMED]?: boolean;
  [OldEmailSubscriberKeys.OPT_IN_TIMESTAMP]?: number;
  sendgridContactId?: string;
}