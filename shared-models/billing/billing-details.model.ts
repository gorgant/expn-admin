export enum BillingKeys {
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

export interface BillingDetails {
  [BillingKeys.FIRST_NAME]: string;
  [BillingKeys.LAST_NAME]: string;
  [BillingKeys.EMAIL]: string;
  [BillingKeys.PHONE]: string;
  [BillingKeys.BILLING_ONE]: string;
  [BillingKeys.BILLING_TWO]: string;
  [BillingKeys.CITY]: string;
  [BillingKeys.STATE]: string;
  [BillingKeys.US_STATE_CODE]: string;
  [BillingKeys.POSTAL_CODE]: string;
  [BillingKeys.COUNTRY]: string;
  [BillingKeys.COUNTRY_CODE]: string;
}
