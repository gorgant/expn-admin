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
  imageUrl: [
    { type: 'required', message: 'Image url is required.'},
  ],
  checkoutHeader: [
    { type: 'required', message: 'Checkout header is required.'},
  ],
  description: [
    { type: 'required', message: 'Description is required.'},
  ],
  mdBlurb: [
    { type: 'required', message: 'Blurb is required.'},
  ],
  highlight: [
    { type: 'required', message: 'Highlight cannot be blank.'},
  ],
};
