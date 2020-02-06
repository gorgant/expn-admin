export enum AdminFunctionNames {
  RESIZE_IMAGES = 'resizeImages',
  CREATE_ADMIN_USER = 'createAdminUser',
  UPDATE_PUBLIC_BLOG_POST = 'updatePublicBlogPost',
  UPDATE_PRODUCT = 'updateProduct',
  UPDATE_GEOGRAPHIC_DATA = 'updateGeographicData',
  STORE_ORDER = 'storeOrder',
  STORE_EMAIL_SUB = 'storeEmailSub',
  STORE_CONTACT_FORM = 'storeContactForm',
  BACKUP_ADMIN_DATABASE = 'backupAdminDatabase',
  SG_EMAIL_WEBHOOK_ENDPOINT = 'sgEmailWebhookEndpoint',
  AUTO_PUBLISH_BLOG_POSTS = 'autoPublishBlogPosts',
  SEND_SENDGRID_TEST = 'sendSendgridTest',
  UPDATE_SENDGRID_CONTACT = 'updateSendgridContact'
}

export enum PublicFunctionNames {
  STRIPE_ATTACH_SOURCE = 'stripeAttachSource',
  STRIPE_PROCESS_CHARGE = 'stripeProcessCharge',
  TRANSMIT_ORDER_TO_ADMIN = 'transmitOrderToAdmin',
  TRANSMIT_EMAIL_SUB_TO_ADMIN = 'transmitEmailSubToAdmin',
  TRANSMIT_CONTACT_FORM_TO_ADMIN = 'transmitContactFormToAdmin',
  TRANSMIT_WEBPAGE_URLS_TO_SSR = 'transmitWebpageUrlsToSsr',
  UPDATE_WEBPAGE_CACHE = 'updateWebpageCache',
  PURGE_INACTIVE_USERS = 'purgeInactiveUsers',
  UPDATE_PODCAST_FEED_CACHE = 'updatePodcastFeedCache',
  UNIVERSAL_SSR = 'universalSsr'
}
