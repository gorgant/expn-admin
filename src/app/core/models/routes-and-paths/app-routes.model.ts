export enum AppRoutes {
  LOGIN = '/login',
  HOME = '/home',
  BLOG_DASHBOARD = '/blog/dashboard',
  BLOG_NEW_POST = '/blog/new',
  BLOG_EDIT_POST = '/blog/existing', // Note this also requires an ID route param to be appended to it
  BLOG_PREVIEW_POST = '/blog/preview', // Note this also requires an ID route param to be appended to it
  DATA_IMPORTS = '/data-imports'
}
