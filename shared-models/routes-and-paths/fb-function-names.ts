export enum AdminFunctionNames {
  RESIZE_IMAGES = 'resizeImages',
  UPDATE_PUBLIC_BLOG_POST = 'updatePublicBlogPost',
  UPDATE_PRODUCT = 'updateProduct',
  UPDATE_GEOGRAPHIC_DATA = 'updateGeographicData',
  SAVE_ORDER_TOPIC = 'save-order',
  SAVE_EMAIL_SUB_TOPIC = 'save-email-sub',
  SAVE_CONTACT_FORM_TOPIC = 'save-contact-form'
}

export enum PublicFunctionNames {
  STRIPE_ATTACH_SOURCE = 'stripeAttachSource',
  STRIPE_PROCESS_CHARGE = 'stripeProcessCharge',
  STRIPE_GET_CHARGES = 'stripeGetCharges',
  STRIPE_CREATE_SUBSCRIPTION = 'stripeCreateSubscription',
  STRIPE_GET_SUBSCRIPTION = 'stripeGetSubscriptions',
  STRIPE_CANCEL_SUBSCRIPTION = 'stripeCancelSubscription',
  STRIPE_INVOICE_WEBHOOK_ENDPOINT = 'invoiceWebhookEndpoint',
  STRIPE_SUBSCRIPTION_WEBHOOK_ENDPOINT = 'subscriptionWebhookEndpoint',
  STRIPE_GET_COUPON = 'stripeGetCoupon',
  TRANSMIT_ORDER_TO_ADMIN = 'transmitOrderToAdmin',
  TRANSMIT_EMAIL_SUB_TO_ADMIN = 'transmitEmailSubToAdmin',
  TRANSMIT_CONTACT_FORM_TO_ADMIN = 'transmitContactFormToAdmin',
}
