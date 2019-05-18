export const SUBSCRIBE_VALIDATION_MESSAGES = {
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
};

export const loginValidationMessages = {
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  password: [
    { type: 'required', message: 'Password is required.' },
  ]
};

export const resetPasswordFormValidationMessages = {
  email: [
    { type: 'required', message: 'Email is required.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
};

export const PRODUCT_FORM_VALIDATION_MESSAGES = {
  name: [
    { type: 'required', message: 'Name is required.'},
  ],
  price: [
    { type: 'required', message: 'Price is required.'},
  ],
  listOrder: [
    { type: 'required', message: 'List order is required.'},
  ],
  tagline: [
    { type: 'required', message: 'Tagline is required.'},
  ],
  highlight: [
    { type: 'required', message: 'Highlight cannot be blank.'},
  ],
  heroSubtitle: [
    { type: 'required', message: 'Hero subtitle required.'},
  ],
  buyNowBoxSubtitle: [
    { type: 'required', message: 'Buy now box subtitle required.'},
  ],
  checkoutHeader: [
    { type: 'required', message: 'Checkout header is required.'},
  ],
  checkoutDescription: [
    { type: 'required', message: 'Checkout description is required.'},
  ],
};
