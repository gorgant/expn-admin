import { BillingKeys } from 'shared-models/billing/billing-details.model';
import { ContactFormKeys } from 'shared-models/user/contact-form.model';

export const SUBSCRIBE_VALIDATION_MESSAGES = {
  [BillingKeys.FIRST_NAME]: [
    { type: 'required', message: 'First name is required.'},
  ],
  [BillingKeys.EMAIL]: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
};

export const BILLING_VALIDATION_MESSAGES = {
  billingDetailsGroup: [
    { type: 'required', message: 'Billing details are missing.'},
    { type: 'invalid', message: 'Billing details have an error.'},
  ],
  [BillingKeys.FIRST_NAME]: [
    { type: 'required', message: 'First name is required.'},
  ],
  [BillingKeys.LAST_NAME]: [
    { type: 'required', message: 'Last name is required.'},
  ],
  [BillingKeys.EMAIL]: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  [BillingKeys.PHONE]: [
    { type: 'required', message: 'Phone is required.'},
  ],
  [BillingKeys.BILLING_ONE]: [
    { type: 'required', message: 'Billing address is required.'},
  ],
  [BillingKeys.BILLING_TWO]: [
    { type: 'required', message: 'Billing address is required.'},
  ],
  [BillingKeys.CITY]: [
    { type: 'required', message: 'City is required.'},
  ],
  [BillingKeys.STATE]: [
    { type: 'required', message: 'State/Province is required.'},
  ],
  [BillingKeys.US_STATE_CODE]: [
    { type: 'required', message: 'State is required.'},
  ],
  [BillingKeys.POSTAL_CODE]: [
    { type: 'required', message: 'Zip/Postal Code is required.'},
  ],
  [BillingKeys.COUNTRY_CODE]: [
    { type: 'required', message: 'Country is required.'},
  ],
};

export const CREDIT_CARD_VALIDATION_MESSAGES = {
  creditCardDetailsGroup: [
    { type: 'required', message: 'Credit card details are missing.'},
    { type: 'invalid', message: 'Credit card details have an error.'},
  ],
  cardType: [
    { type: 'required', message: 'Credit card type is required.'},
  ],
  cardNumber: [
    { type: 'required', message: 'Credit card number is required.'},
  ],
  cardMonth: [
    { type: 'required', message: 'Expiration month is required.'},
  ],
  cardYear: [
    { type: 'required', message: 'Expiration year is required'},
  ],
  cardCvc: [
    { type: 'required', message: 'Credit card CVC is required'},
  ]
};

export const CONTACT_VALIDATION_MESSAGES = {
  [BillingKeys.FIRST_NAME]: [
    { type: 'required', message: 'Name is required.'},
  ],
  [BillingKeys.EMAIL]: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  [ContactFormKeys.MESSAGE]: [
    { type: 'required', message: 'Message is required.'},
  ]
};
