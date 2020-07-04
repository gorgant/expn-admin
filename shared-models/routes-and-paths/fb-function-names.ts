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
  UPDATE_SENDGRID_CONTACT = 'updateSendgridContact',
  TRIGGER_EMAIL_SEND = 'triggerEmailSend',
  REFRESH_PUBLIC_BLOG_INDEX = 'refreshPublicBlogIndex',
  REFRESH_PUBLIC_BLOG_CACHE = 'refreshPublicBlogCache',
  REFRESH_PUBLIC_FEATURED_POSTS_CACHE = 'refreshPublicFeaturedPostsCache',
  PURGE_INACTIVE_EDITOR_SESSIONS = 'purgeInactiveEditorSessions'
}

export enum AdminTopicNames {
  BACKUP_ADMIN_DATABASE_TOPIC = 'backup-admin-database-topic',
  SAVE_ORDER_TOPIC = 'save-order-topic',
  SAVE_EMAIL_SUB_TOPIC = 'save-email-sub-topic',
  SAVE_CONTACT_FORM_TOPIC = 'save-contact-form-topic',
  TRIGGER_EMAIL_SEND_TOPIC = 'trigger-email-send-topic'
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
  UNIVERSAL_SSR = 'universalSsr',
  MARK_SUB_OPTED_IN = 'markSubOptedIn',
  VALIDATE_DISCOUNT_COUPON = 'validateDiscountCoupon'
}

export enum PublicTopicNames {
  SAVE_WEBPAGE_TO_CACHE_TOPIC = 'save-webpage-to-cache-topic',
  UPDATE_DISCOUNT_COUPON_DATA = 'update-discount-coupon-data'
}
