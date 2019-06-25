export const SUBSCRIBE_VALIDATION_MESSAGES = {
  firstName: [
    { type: 'required', message: 'First name is required.'},
  ],
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
};

export const BILLING_VALIDATION_MESSAGES = {
  billingDetailsGroup: [
    { type: 'required', message: 'Billing details are missing.'},
    { type: 'invalid', message: 'Billing details have an error.'},
  ],
  firstName: [
    { type: 'required', message: 'First name is required.'},
  ],
  lastName: [
    { type: 'required', message: 'Last name is required.'},
  ],
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  phone: [
    { type: 'required', message: 'Phone is required.'},
  ],
  billingOne: [
    { type: 'required', message: 'Billing address is required.'},
  ],
  billingTwo: [
    { type: 'required', message: 'Billing address is required.'},
  ],
  city: [
    { type: 'required', message: 'City is required.'},
  ],
  state: [
    { type: 'required', message: 'State/Province is required.'},
  ],
  usStateCode: [
    { type: 'required', message: 'State is required.'},
  ],
  postalCode: [
    { type: 'required', message: 'Zip/Postal Code is required.'},
  ],
  countryCode: [
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
  firstName: [
    { type: 'required', message: 'Name is required.'},
  ],
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  message: [
    { type: 'required', message: 'Message is required.'},
  ]
};
