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

export const POST_FORM_VALIDATION_MESSAGES = {
  title: [
    { type: 'required', message: 'Title is required.'},
  ],
  videoUrl: [
    { type: 'required', message: 'Video URL is required.'},
  ],
  description: [
    { type: 'required', message: 'Description is required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
  ],
  keywords: [
    { type: 'requried', message: 'Keywords are required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
  ]
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

export const EMAIL_FORM_VALIDATION_MESSAGES = {
  email: [
    { type: 'required', message: 'You must provide an email.'},
    { type: 'email', message: 'Not a valid email.'},
  ],
  password: [
    { type: 'required', message: 'You must confirm your current password.'},
  ]
};

export const NAME_FORM_VALIDATION_MESSAGES = {
  name: [
    { type: 'required', message: 'You must provide a name.'},
  ]
};

export const PASSWORD_FORM_VALIDATION_MESSAGES = {
  oldPassword: [
    { type: 'required', message: 'You must provide your current password.'},
  ],
  newPassword: [
    { type: 'required', message: 'You must provide a new password.'},
    { type: 'minlength', message: 'Must be at least 6 characters' },
  ],
  confirmNewPassword: [
    { type: 'required', message: 'You must confirm your new password.'},
  ],
  updatedPwGroup: [
    { type: 'noMatch', message: 'Your new passwords must match.'},
  ],
  oldPwGroup: [
    { type: 'match', message: 'Your new password cannot match your old password.'}
  ]
};
