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
