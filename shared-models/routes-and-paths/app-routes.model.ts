export enum AdminAppRoutes {
  ACCOUNT = '/account',
  AUTH_LOGIN = '/auth/login',
  BLOG = '/blog',
  BLOG_EDIT_POST = '/blog/edit', // Note this also requires an ID route param to be appended to it
  BLOG_NEW_POST = '/blog/new',
  HOME = '/home',
  SUBSCRIBERS = '/subscribers',
}

export enum PublicAppRoutes {
  ABOUT_ME = '/about',
  BLOG = '/blog',
  CONTACT = '/contact',
  EMAIL_VERIFICATION = '/email-verification',
  HOME = '',
  PODCAST = '/podcast',
  PRIVACY_POLICY = '/privacy-policy',
  TERMS_AND_CONDITIONS = '/terms-and-conditions',
}
