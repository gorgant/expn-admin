import { WebDomains } from "../meta/web-urls.model";

export enum EnvironmentTypes {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

export const PRODUCTION_APPS = {
  advePublicApp: {
    databaseURL: 'https://adve-public.firebaseio.com',
    projectId: 'adve-public',
    storageBucket: 'adve-public.appspot.com',
    websiteDomain: WebDomains.ADVE_PUBLIC,
  },
  adveAdminApp: {
    databaseURL: 'https://adve-admin.firebaseio.com',
    projectId: 'adve-admin',
    storageBucket: 'adve-admin.appspot.com',
    websiteDomain: WebDomains.ADVE_ADMIN,
  },
  expnPublicApp: {
    databaseURL: 'https://explearning-76d93.firebaseio.com',
    projectId: 'explearning-76d93',
    storageBucket: 'explearning-76d93.appspot.com',
    websiteDomain: WebDomains.EXPN_PUBLIC,
  },
  expnAdminApp: {
    databaseURL: 'https://explearning-admin.firebaseio.com',
    projectId: 'explearning-admin',
    storageBucket: 'explearning-admin.appspot.com',
    websiteDomain: WebDomains.EXPN_ADMIN,
  },
  mdlsPublicApp: {
    databaseURL: 'https://marydaphne-public.firebaseio.com',
    projectId: 'marydaphne-public',
    storageBucket: 'marydaphne-public.appspot.com',
    websiteDomain: WebDomains.MDLS_PUBLIC,
  },
  mdlsAdminApp: {
    databaseURL: 'https://marydaphne-admin.firebaseio.com',
    projectId: 'marydaphne-admin',
    storageBucket: 'marydaphne-admin.appspot.com',
    websiteDomain: WebDomains.MDLS_ADMIN,
  },
  sywPublicApp: {
    databaseURL: 'https://syw-public.firebaseio.com',
    projectId: 'syw-public',
    storageBucket: 'syw-public.appspot.com',
    websiteDomain: WebDomains.SYW_PUBLIC,
  },
  sywAdminApp: {
    databaseURL: 'https://syw-admin.firebaseio.com',
    projectId: 'syw-admin',
    storageBucket: 'syw-admin.appspot.com',
    websiteDomain: WebDomains.SYW_ADMIN,
  },
  
};

export const SANDBOX_APPS = {
  advePublicApp: {
    databaseURL: 'https://adve-sandbox-public.firebaseio.com',
    projectId: 'adve-sandbox-public',
    storageBucket: 'adve-sandbox-public.appspot.com',
    websiteDomain: 'adve-sandbox-public.web.app',
  },
  adveAdminApp: {
    databaseURL: 'https://adve-sandbox-admin.firebaseio.com',
    projectId: 'adve-sandbox-admin',
    storageBucket: 'adve-sandbox-admin.appspot.com',
    websiteDomain: 'adve-sandbox-admin.web.app',
  },
  expnPublicApp: {
    databaseURL: 'https://explearning-sandbox-public.firebaseio.com',
    projectId: 'explearning-sandbox-public',
    storageBucket: 'explearning-sandbox-public.appspot.com',
    websiteDomain: 'explearning-sandbox-public.web.app',
  },
  expnAdminApp: {
    databaseURL: 'https://explearning-sandbox-admin.firebaseio.com',
    projectId: 'explearning-sandbox-admin',
    storageBucket: 'explearning-sandbox-admin.appspot.com',
    websiteDomain: 'explearning-sandbox-admin.web.app',
    cloudSchedulerServiceAccount: 'gcr-cloud-scheduler@explearning-sandbox-admin.iam.gserviceaccount.com',
  },
  mdlsPublicApp: {
    databaseURL: 'https://marydaphne-sandbox-public.firebaseio.com',
    projectId: 'marydaphne-sandbox-public',
    storageBucket: 'marydaphne-sandbox-public.appspot.com',
    websiteDomain: 'marydaphne-sandbox-public.web.app',
  },
  mdlsAdminApp: {
    databaseURL: 'https://marydaphne-sandbox-admin.firebaseio.com',
    projectId: 'marydaphne-sandbox-admin',
    storageBucket: 'marydaphne-sandbox-admin.appspot.com',
    websiteDomain: 'marydaphne-sandbox-admin.web.app',
  },
  sywPublicApp: {
    databaseURL: 'https://syw-sandbox-public.firebaseio.com',
    projectId: 'syw-sandbox-public',
    storageBucket: 'syw-sandbox-public.appspot.com',
    websiteDomain: 'syw-sandbox-public.web.app',
  },
  sywAdminApp: {
    databaseURL: 'https://syw-sandbox-admin.firebaseio.com',
    projectId: 'syw-sandbox-admin',
    storageBucket: 'syw-sandbox-admin.appspot.com',
    websiteDomain: 'syw-sandbox-admin.web.app',
  },

};

export enum ProductionCloudStorage {
  EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX = 'explearning-admin-blog',
  EXPN_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://explearning-admin-blog',
  EXPN_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'explearning-admin-backup',
  EXPN_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://explearning-admin-backup',
  EXPN_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'explearning-admin-data-imports',
  EXPN_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://explearning-admin-data-imports',
  EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'explearning-admin-reports',
  EXPN_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://explearning-admin-reports',
  MDLS_ADMIN_BLOG_STORAGE_NO_PREFIX = 'marydaphne-admin-blog',
  MDLS_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://marydaphne-admin-blog',
  MDLS_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'marydaphne-admin-backup',
  MDLS_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://marydaphne-admin-backup',
  MDLS_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'marydaphne-admin-data-imports',
  MDLS_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://marydaphne-admin-data-imports',
  MDLS_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'marydaphne-admin-reports',
  MDLS_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://marydaphne-admin-reports',
  SYW_ADMIN_BLOG_STORAGE_NO_PREFIX = 'syw-admin-blog',
  SYW_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://syw-admin-blog',
  SYW_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'syw-admin-backup',
  SYW_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://syw-admin-backup',
  SYW_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'syw-admin-data-imports',
  SYW_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://syw-admin-data-imports',
  SYW_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'syw-admin-reports',
  SYW_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://syw-admin-reports',
  ADVE_ADMIN_BLOG_STORAGE_NO_PREFIX = 'adve-admin-blog',
  ADVE_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://adve-admin-blog',
  ADVE_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'adve-admin-backup',
  ADVE_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://adve-admin-backup',
  ADVE_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'adve-admin-data-imports',
  ADVE_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://adve-admin-data-imports',
  ADVE_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'adve-admin-reports',
  ADVE_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://adve-admin-reports',
}

export enum SandboxCloudStorage {
  EXPN_ADMIN_BLOG_STORAGE_NO_PREFIX = 'explearning-sandbox-admin-blog',
  EXPN_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://explearning-sandbox-admin-blog',
  EXPN_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'explearning-sandbox-admin-backup',
  EXPN_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://explearning-sandbox-admin-backup',
  EXPN_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'explearning-sandbox-admin-data-imports',
  EXPN_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://explearning-sandbox-admin-data-imports',
  EXPN_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'explearning-sandbox-admin-reports',
  EXPN_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://explearning-sandbox-admin-reports',
  MDLS_ADMIN_BLOG_STORAGE_NO_PREFIX = 'marydaphne-sandbox-admin-blog',
  MDLS_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://marydaphne-sandbox-admin-blog',
  MDLS_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'marydaphne-sandbox-admin-backup',
  MDLS_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://marydaphne-sandbox-admin-backup',
  MDLS_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'marydaphne-sandbox-admin-data-imports',
  MDLS_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://marydaphne-sandbox-admin-data-imports',
  MDLS_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'marydaphne-sandbox-admin-reports',
  MDLS_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://marydaphne-sandbox-admin-reports',
  SYW_ADMIN_BLOG_STORAGE_NO_PREFIX = 'syw-sandbox-admin-blog',
  SYW_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://syw-sandbox-admin-blog',
  SYW_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'syw-sandbox-admin-backup',
  SYW_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://syw-sandbox-admin-backup',
  SYW_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'syw-sandbox-admin-data-imports',
  SYW_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://syw-sandbox-admin-data-imports',
  SYW_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'syw-sandbox-admin-reports',
  SYW_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://syw-sandbox-admin-reports',
  ADVE_ADMIN_BLOG_STORAGE_NO_PREFIX = 'adve-sandbox-admin-blog',
  ADVE_ADMIN_BLOG_STORAGE_GS_PREFIX = 'gs://adve-sandbox-admin-blog',
  ADVE_ADMIN_BACKUP_STORAGE_NO_PREFIX = 'adve-sandbox-admin-backup',
  ADVE_ADMIN_BACKUP_STORAGE_GS_PREFIX = 'gs://adve-sandbox-admin-backup',
  ADVE_ADMIN_DATA_IMPORTS_STORAGE_NO_PREFIX = 'adve-sandbox-admin-data-imports',
  ADVE_ADMIN_DATA_IMPORTS_STORAGE_GS_PREFIX = 'gs://adve-sandbox-admin-data-imports',
  ADVE_ADMIN_REPORTS_STORAGE_NO_PREFIX = 'adve-sandbox-admin-reports',
  ADVE_ADMIN_REPORTS_STORAGE_GS_PREFIX = 'gs://adve-sandbox-admin-reports',
}

export enum SecretsManagerKeyNames {
  ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS = 'ALTERNATE_PROJECT_SERVICE_ACCOUNT_CREDS',
  CLOUD_SCHEDULER_SERVICE_ACCOUNT_EMAIL = 'CLOUD_SCHEDULER_SERVICE_ACCOUNT_EMAIL',
  SENDGRID = 'SENDGRID',
}