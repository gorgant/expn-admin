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
  DATA_IMPORTS = '/data-imports'
}

export enum PublicAppRoutes {
  HOME = '/home',
  ABOUT_ME = '/about',
  PRODUCTS = '/products',
  PRODUCT_INDIVIDUAL = '/products/product',
  CHECKOUT = '/products/checkout',
  PURCHASE_CONFIRMATION = '/products/purchase-confirmation',
  BLOG = '/blog',
  PODCAST = '/podcast',
  CONTACT = '/contact',
}
