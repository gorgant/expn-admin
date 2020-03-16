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
  blogDomain: [
    {type: 'required', message: 'Blog domain is required.'}
  ],
  title: [
    { type: 'required', message: 'Title is required.'},
  ],
  videoUrl: [
    { type: 'required', message: 'Video URL is required.'},
    { type: 'pattern', message: 'Invalid url.' }
  ],
  podcastEpisodeUrl: [
    { type: 'required', message: 'Podcast episode URL is required.'},
    { type: 'pattern', message: 'Invalid url.' }
  ],
  description: [
    { type: 'required', message: 'Description is required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
  ],
  keywords: [
    { type: 'requried', message: 'Keywords are required'},
    { type: 'maxlength', message: 'Entry exceeds max length' }
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

export const SCHEDULE_POST_FORM_VALIDATION_MESSAGES = {
  publishDate: [
    { type: 'required', message: 'You must provide a scheduled date.'},
  ],
  publishHour: [
    { type: 'required', message: 'Provide an hour between 0 and 23'},
    { type: 'min', message: 'Value must be between 0 and 23.'},
    { type: 'max', message: 'Value be between 0 and 23.'},
  ],
  publishMin: [
    { type: 'required', message: 'Provide a minute between 0 and 60'},
    { type: 'min', message: 'Value must be between 0 and 59.'},
    { type: 'max', message: 'Value must be between 0 and 59.'},
  ]
};

export const COUPON_FORM_VALIDATION_MESSAGES = {
  couponCode: [
    {type: 'required', message: 'This field is required.'},
    {type: 'pattern', message: 'Coupon code can only contain letters and numbers with no spaces.'},
  ],
  discountPercentage: [
    { type: 'required', message: 'This field is required.'},
    { type: 'max', message: 'Value cannot exceed 100'},
    { type: 'min', message: 'Value cannot be less than 1'},
  ],
  expirationDate: [
    { type: 'required', message: 'This field is required.'},
  ],
  expirationHour: [
    { type: 'required', message: 'Provide an hour between 0 and 23'},
    { type: 'min', message: 'Value must be between 0 and 23.'},
    { type: 'max', message: 'Value be between 0 and 23.'},
  ],
  expirationMin: [
    { type: 'required', message: 'Provide a minute between 0 and 60'},
    { type: 'min', message: 'Value must be between 0 and 59.'},
    { type: 'max', message: 'Value must be between 0 and 59.'},
  ],
  maxUses: [
    { type: 'required', message: 'This field is required.'},
    { type: 'min', message: 'Value cannot be less than 1.' }
  ],
  userSpecific: [
    { type: 'required', message: 'This field is required.'},
  ],
  productSpecific: [
    { type: 'required', message: 'This field is required.'},
  ],
  maxUsesPerUser: [
    { type: 'min', message: 'Value cannot be less than 1.'},
    { type: 'max', message: 'Value cannot exceed overall max use limit above.'},
  ],
};
