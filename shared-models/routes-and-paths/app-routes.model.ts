export enum AdminAppRoutes {
  LOGIN = '/login',
  HOME = '/home',
  ORDERS_DASHBOARD = '/orders/dashboard',
  ORDERS_ORDER_DETAILS = '/orders/existing', // Note this also requires an ID route param to be appended to it
  BLOG_DASHBOARD = '/blog/dashboard',
  BLOG_NEW_POST = '/blog/new',
  BLOG_EDIT_POST = '/blog/existing', // Note this also requires an ID route param to be appended to it
  BLOG_PREVIEW_POST = '/blog/preview', // Note this also requires an ID route param to be appended to it
  PRODUCT_DASHBOARD = '/products/dashboard',
  PRODUCT_NEW = '/products/new',
  PRODUCT_EDIT = '/products/existing', // Note this also requires an ID route param to be appended to it
  SUBSCRIBER_DASHBOARD = '/subscribers/dashboard',
  CONTACT_FORM_DASHBOARD = '/contact-forms/dashboard',
  CONTACT_FORM_DETAILS = '/contact-forms/existing', // Note this also requires an ID route param to be appended to it
  DATA_IMPORTS = '/data-imports',
  PROFILE = '/profile'
}

export enum PublicAppRoutes {
  HOME = '',
  ABOUT_ME = '/about',
  PRODUCTS = '/products',
  CHECKOUT = '/products/checkout',
  PURCHASE_CONFIRMATION = '/products/purchase-confirmation',
  BLOG = '/blog',
  PODCAST = '/podcast',
  CONTACT = '/contact',
  PRIVACY_POLICY = '/legal/privacy-policy',
  TERMS_AND_CONDITIONS = '/legal/terms-and-conditions',
}
