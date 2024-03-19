import { ShorthandBusinessNames } from "../meta/business-info.model";
import { WebDomains } from "../meta/web-urls.model";

export enum EmailIdentifiers {
  AUTO_NOTICE_NEW_USER_SIGNUP = 'auto-notice-new-user-signup',
  AUTO_NOTICE_OPT_IN_MISMATCH = 'auto-notice-opt-in-mismatch',
  AUTO_NOTICE_WEBPAGE_DATA_LOAD_FAILURE = 'auto-notice-webpage-data-load-failure',
  CONTACT_FORM_CONFIRMATION = 'contact-form-confirmation',
  EMAIL_VERIFICATION = 'email-verification',
  PRIMARY_NEWSLETTER = 'primary-newslettercccccbhnk',
  ONBOARDING_WELCOME = 'onboarding-welcome',
  TEST_SEND = 'test-send',
  UPDATE_EMAIL_CONFIRMATION = 'update-email-confirmation'
}

// Ids sourced from Sendgrid template system
export enum SendgridEmailTemplateIds {
  ADVE_CONTACT_FORM_CONFIRMATION = 'd-30ecd808839443f1a3b941c8e4a43d82',
  ADVE_EMAIL_VERIFICATION = 'd-278d02a459384530b9e71cb338e0046d',
  ADVE_ONBOARDING_WELCOME = 'd-539dc1e2c38a4c14a16ba52a167bccb9',
  ADVE_UPDATE_EMAIL_CONFIRMATION = 'tbd',
  EXPN_CONTACT_FORM_CONFIRMATION = 'd-0dbb4cd9b1a74e6faf8a62d2765046f2',
  EXPN_EMAIL_VERIFICATION = 'd-b6beec26f3d644e3b4eafc4213d281db',
  EXPN_ONBOARDING_WELCOME = 'd-7327446fd2714cf0a605884dc9ce67fa',
  EXPN_UPDATE_EMAIL_CONFIRMATION = 'tbd',
  MDLS_CONTACT_FORM_CONFIRMATION = 'd-68ffed5939564e2181e07f17b1380869',
  MDLS_EMAIL_VERIFICATION = 'd-ff70ac624ec243e789efa74b0411f971',
  MDLS_ONBOARDING_WELCOME = 'd-1d5174c867e445be9fc4f4eaed7bc241',
  MDLS_UPDATE_EMAIL_CONFIRMATION = 'tbd',
  SYW_CONTACT_FORM_CONFIRMATION = 'd-e058fdbaa080487285a8391258a6ef08',
  SYW_EMAIL_VERIFICATION = 'd-776824ed40bf44efa371843d0073ec25',
  SYW_ONBOARDING_WELCOME = 'd-99c64a8b00364a6cb1af1fb9e0b16eac',
  SYW_UPDATE_EMAIL_CONFIRMATION = 'tbd',
}

export enum SendgridContactListId {
  ADVE_PRIMARY_NEWSLETTER = '4cd8cb6e-8ac4-433a-877d-829cf99be715',
  EXPN_PRIMARY_NEWSLETTER = '12e2e831-4713-458f-a103-f96bc48c314b',
  MDLS_PRIMARY_NEWSLETTER = 'e0b66287-629c-4365-b1ed-fbec6f71db67',
  SYW_PRIMARY_NEWSLETTER = '422a87c7-66ce-469e-b614-81bab3b2c05c',
}

export enum SendgridEmailUnsubscribeGroupIds {
  ADVE_PRIMARY_NEWSLETTER = 17226,
  EXPN_PRIMARY_NEWSLETTER = 13988,
  MDLS_PRIMARY_NEWSLETTER = 10012,
  SYW_PRIMARY_NEWSLETTER = 22515,
}

// The UnsubGroupId/ContactListId pair
export interface UnsubIdContactListPairingRecord {
  unsubGroupId: number;
  contactListId: string;
}

// The object containing any number of UnsubGroupId/ContactListId pairs
export interface UnsubIdContactListPairingList {
  [key: string]: UnsubIdContactListPairingRecord;
}

// Allows for addition and removal of contact lists from user profile when subscribing or unsubscribing
export const SendgridUnsubGroupIdContactListPairings: UnsubIdContactListPairingList = {
  [SendgridEmailUnsubscribeGroupIds.ADVE_PRIMARY_NEWSLETTER]: {
    unsubGroupId: SendgridEmailUnsubscribeGroupIds.ADVE_PRIMARY_NEWSLETTER,
    contactListId: SendgridContactListId.ADVE_PRIMARY_NEWSLETTER
  },
  [SendgridEmailUnsubscribeGroupIds.EXPN_PRIMARY_NEWSLETTER]: {
    unsubGroupId: SendgridEmailUnsubscribeGroupIds.EXPN_PRIMARY_NEWSLETTER,
    contactListId: SendgridContactListId.EXPN_PRIMARY_NEWSLETTER
  },
  [SendgridEmailUnsubscribeGroupIds.MDLS_PRIMARY_NEWSLETTER]: {
    unsubGroupId: SendgridEmailUnsubscribeGroupIds.MDLS_PRIMARY_NEWSLETTER,
    contactListId: SendgridContactListId.MDLS_PRIMARY_NEWSLETTER
  },
  [SendgridEmailUnsubscribeGroupIds.SYW_PRIMARY_NEWSLETTER]: {
    unsubGroupId: SendgridEmailUnsubscribeGroupIds.SYW_PRIMARY_NEWSLETTER,
    contactListId: SendgridContactListId.SYW_PRIMARY_NEWSLETTER
  },
}

export const EmailSenderAddresses = {
  ADVE_DEFAULT: `hello@${WebDomains.ADVE_EMAIL}`,
  ADVE_NEWSLETTER: `newsletter@${WebDomains.ADVE_EMAIL}`,
  ADVE_ADMIN: `admin@${WebDomains.ADVE_EMAIL}`,
  ADVE_SUPPORT: `hello@${WebDomains.ADVE_EMAIL}`,
  EXPN_DEFAULT: `hello@${WebDomains.EXPN_EMAIL}`,
  EXPN_NEWSLETTER: `newsletter@${WebDomains.EXPN_EMAIL}`,
  EXPN_ADMIN: `admin@${WebDomains.EXPN_EMAIL}`,
  EXPN_SUPPORT: `hello@${WebDomains.EXPN_EMAIL}`,
  MDLS_DEFAULT: `hello@${WebDomains.MDLS_EMAIL}`,
  MDLS_NEWSLETTER: `newsletter@${WebDomains.MDLS_EMAIL}`,
  MDLS_ADMIN: `admin@${WebDomains.MDLS_EMAIL}`,
  MDLS_SUPPORT: `hello@${WebDomains.MDLS_EMAIL}`,
  SYW_DEFAULT: `hello@${WebDomains.SYW_EMAIL}`,
  SYW_NEWSLETTER: `newsletter@${WebDomains.SYW_EMAIL}`,
  SYW_ADMIN: `admin@${WebDomains.SYW_EMAIL}`,
  SYW_SUPPORT: `hello@${WebDomains.SYW_EMAIL}`,
}

export const EmailSenderNames = {
  ADVE_DEFAULT: `${ShorthandBusinessNames.ADVE}`,
  ADVE_NEWSLETTER: `${ShorthandBusinessNames.ADVE}`,
  ADVE_ADMIN: `${ShorthandBusinessNames.ADVE} ADMIN`,
  EXPN_DEFAULT: `${ShorthandBusinessNames.EXPN}`,
  EXPN_NEWSLETTER: `${ShorthandBusinessNames.EXPN}`,
  EXPN_ADMIN: `${ShorthandBusinessNames.EXPN} ADMIN`,
  MDLS_DEFAULT: `${ShorthandBusinessNames.MDLS}`,
  MDLS_NEWSLETTER: `${ShorthandBusinessNames.MDLS}`,
  MDLS_ADMIN: `${ShorthandBusinessNames.MDLS} ADMIN`,
  SYW_DEFAULT: `${ShorthandBusinessNames.SYW}`,
  SYW_NEWSLETTER: `${ShorthandBusinessNames.SYW}`,
  SYW_ADMIN: `${ShorthandBusinessNames.SYW} ADMIN`,
}

export const AdminEmailAddresses = {
  ADVE_ADMIN: `greg@${WebDomains.ADVE_EMAIL}`,
  ADVE_GREG: `greg@${WebDomains.ADVE_EMAIL}`,
  ADVE_DEFAULT: `hello@${WebDomains.ADVE_EMAIL}`,
  ADVE_MD: `greg@${WebDomains.ADVE_EMAIL}`,
  ADVE_TEST_1: `greg+test1@${WebDomains.ADVE_EMAIL}`,
  EXPN_ADMIN: `greg@${WebDomains.EXPN_EMAIL}`,
  EXPN_GREG: `greg@${WebDomains.EXPN_EMAIL}`,
  EXPN_DEFAULT: `hello@${WebDomains.EXPN_EMAIL}`,
  EXPN_MD: `md@${WebDomains.EXPN_EMAIL}`,
  EXPN_TEST_1: `greg+test1@${WebDomains.EXPN_EMAIL}`,
  MDLS_ADMIN: `greg@${WebDomains.EXPN_EMAIL}`,
  MDLS_GREG: `greg@${WebDomains.MDLS_EMAIL}`,
  MDLS_DEFAULT: `hello@${WebDomains.MDLS_EMAIL}`,
  MDLS_MD: `greg@${WebDomains.MDLS_EMAIL}`,
  MDLS_TEST_1: `greg+test1@${WebDomains.MDLS_EMAIL}`,
  SYW_ADMIN: `greg@${WebDomains.EXPN_EMAIL}`,
  SYW_GREG: `greg@${WebDomains.SYW_EMAIL}`,
  SYW_DEFAULT: `hello@${WebDomains.SYW_EMAIL}`,
  SYW_MD: `greg@${WebDomains.SYW_EMAIL}`,
  SYW_TEST_1: `greg+test1@${WebDomains.SYW_EMAIL}`,
};

export type SgContactCustomFieldData = {
  [key in SgContactCustomFieldIds]: string | number | Date;
}

// Sendgrid uses these custom IDs for the custom fields
// To get these ids use postman GET https://api.sendgrid.com/v3/marketing/field_definitions
export enum SgContactCustomFieldIds {
  APP_CREATED_TIMESTAMP = 'e2_D',
  APP_OPT_IN_TIMESTAMP = 'e3_D',
  APP_UID = 'e1_T',
}

export enum SgWebhookSignatureVerificationKeys {
  EXPN_PRODUCTION_KEY = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOWbxrGVfoh0liFoPOYl9mDURv0t1bZH1WA+yNBOjV1T547pYTBI6WuF3+gpteFEq8+WRH5tbpCpsnLuGP5VxCA==`,
  EXPN_SANDBOX_KEY = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEOWbxrGVfoh0liFoPOYl9mDURv0t1bZH1WA+yNBOjV1T547pYTBI6WuF3+gpteFEq8+WRH5tbpCpsnLuGP5VxCA==`,
  ADVE_PRODUCTION_KEY = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEKPSuFTMPBQ/Sef21sR1o6dqouXwy8dbkB+QiQKfuZD0Y8R5P3CkjXlV5A7bqf4gEf83S64FbiOm4Hwgkf7eY8g==`,
  ADVE_SANDBOX_KEY = `MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEKPSuFTMPBQ/Sef21sR1o6dqouXwy8dbkB+QiQKfuZD0Y8R5P3CkjXlV5A7bqf4gEf83S64FbiOm4Hwgkf7eY8g==`,

}

export const ANONYMOUS_EMAIL_ID = 'anonymousEmailId';


