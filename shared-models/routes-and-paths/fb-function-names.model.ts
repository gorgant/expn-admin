export enum AdminFunctionNames {
  ON_AUTH_CREATE_ADMIN_USER = 'onAuthCreateAdminUser',
  ON_CALL_CREATE_POST = 'onCallCreatePost',
  ON_CALL_DELETE_ADMIN_USER = 'onCallDeleteAdminUser',
  ON_CALL_DELETE_POST = 'onCallDeletePost',
  ON_CALL_EXPORT_PUBLIC_USERS = 'onCallExportPublicUsers',
  ON_CALL_PUBLISH_POST = 'onCallPublishPost',
  ON_CALL_PROCESS_PUBLIC_USER_IMPORT_DATA = 'onCallProcessPublicUserImportData',
  ON_CALL_RESIZE_POST_IMAGE = 'onCallResizePostImage',
  ON_CALL_TOGGLE_FEATURED_POST = 'onCallToggleFeaturedPost',
  ON_CALL_UNPUBLISH_POST = 'onCallUnpublishPost',
  ON_CALL_UPDATE_ADMIN_USER = 'onCallUpdateAdminUser',
  ON_CALL_UPDATE_POST = 'onCallUpdatePost',
  ON_CALL_UPDATE_POST_BOILERPLATE = 'onCallUpdatePostBoilerplate',
  ON_DELETE_PURGE_ADMIN_USER_DATA = 'onDeletePurgeAdminUserData',
  ON_PUB_IMPORT_PUBLIC_USERS_TO_DB = 'onPubImportPublicUsersToDb',
  ON_PUB_PARSE_PUBLIC_USER_IMPORT_DATA = 'onPubParsePublicUserImportData',
  ON_REQ_PUBLISH_SCHEDULED_POSTS = 'onReqPublishScheduledPosts',
  ON_REQ_PURGE_EXPIRED_PUBLIC_USER_REPORTS = 'onReqPurgeExpiredPublicUserReports',

  ON_CALL_BACKUP_POST_COLLECTION = 'onCallBackupPostCollection',
  ON_CALL_BACKUP_PUBLIC_USER_COLLECTION = 'onCallBackupPublicUserCollection',
  ON_CALL_MIGRATE_POST_DATA = 'onCallMigratePostData',
  ON_CALL_MIGRATE_PUBLIC_USER_DATA = 'onCallMigratePublicUserData',
}

export enum AdminTopicNames {
  IMPORT_PUBLIC_USERS_TO_DB_TOPIC = 'import-public-users-to-db-topic',
  PARSE_PUBLIC_USER_IMPORT_DATA_TOPIC = 'parse-public-user-import-data-topic',
}

export enum PublicFunctionNames {
  ON_CALL_PROCESS_CONTACT_FORM = 'onCallProcessContactForm',
  ON_CALL_PROCESS_EMAIL_SUBSCRIPTION = 'onCallProcessEmailSubscription',
  ON_CALL_VERIFY_EMAIL = 'onCallVerifyEmail',
  ON_DELETE_PURGE_PUBLIC_USER_DATA = 'onDeletePurgePublicUserData',
  ON_PUB_CREATE_OR_UPDATE_SG_CONTACT = 'onPubCreateOrUpdateSgContact',
  ON_PUB_DELETE_SG_CONTACT = 'onPubDeleteSgContact',
  ON_PUB_DISPATCH_EMAIL = 'onPubDispatchEmail',
  ON_PUB_REMOVE_USER_FROM_SG_CONTACT_LIST = 'onPubRemoveUserFromSgContactList',
  ON_REQ_PURGE_UNVERIFIED_PUBLIC_USERS = 'onReqPurgeUnverifiedPublicUsers',
  ON_REQ_SG_EMAIL_WEBHOOK_ENDPOINT = 'onReqSgEmailWebhookEndpoint',
  ON_REQ_UPDATE_PODCAST_FEED_CACHE = 'onReqUpdatePodcastFeedCache',

  ON_REQ_PURGE_AUTH_USERS = 'onReqPurgeAuthUsers',
}

export enum PublicTopicNames {
  CREATE_OR_UPDATE_SG_CONTACT_TOPIC = 'create-or-update-sg-contact-topic',
  DELETE_SG_CONTACT_TOPIC = 'delete-sg-contact-topic',
  DISPATCH_EMAIL_TOPIC = 'dispatch-email-topic',
  REMOVE_USER_FROM_SG_CONTACT_LIST_TOPIC = 'remove-user-from-sg-contact-list-topic',
  RESET_SG_CONTACT_OPT_IN_STATUS_TOPIC = 'reset-sg-contact-opt-in-status-topic',
}
