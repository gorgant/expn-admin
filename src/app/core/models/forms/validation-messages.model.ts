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
