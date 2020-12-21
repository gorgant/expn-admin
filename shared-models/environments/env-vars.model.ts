export enum EnvironmentTypes {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

export const PRODUCTION_APPS = {
  explearningPublicApp: {
    databaseURL: 'https://explearning-76d93.firebaseio.com',
    projectId: 'explearning-76d93',
    storageBucket: 'explearning-76d93.appspot.com',
    websiteDomain: 'explearning.co'
  },
  explearningAdminApp: {
    databaseURL: 'https://explearning-admin.firebaseio.com',
    projectId: 'explearning-admin',
    storageBucket: 'explearning-admin.appspot.com',
    websiteDomain: 'admin.explearning.co'
  },
  maryDaphnePublicApp: {
    databaseURL: 'https://marydaphne-public.firebaseio.com',
    projectId: 'marydaphne-public',
    storageBucket: 'marydaphne-public.appspot.com',
    websiteDomain: 'marydaphne.com'
  },
  maryDaphneAdminApp: {
    databaseURL: 'https://marydaphne-admin.firebaseio.com',
    projectId: 'marydaphne-admin',
    storageBucket: 'marydaphne-admin.appspot.com',
    websiteDomain: 'admin.marydaphne.com'
  },
  sywPublicApp: {
    databaseURL: 'https://syw-public.firebaseio.com',
    projectId: 'syw-public',
    storageBucket: 'syw-public.appspot.com',
    websiteDomain: 'stakeyourwealth.com'
  },
  sywAdminApp: {
    databaseURL: 'https://syw-admin.firebaseio.com',
    projectId: 'syw-admin',
    storageBucket: 'syw-admin.appspot.com',
    websiteDomain: 'admin.stakeyourwealth.com'
  },
  advePublicApp: {
    databaseURL: 'https://adve-public.firebaseio.com',
    projectId: 'adve-public',
    storageBucket: 'adve-public.appspot.com',
    websiteDomain: 'advancedenglish.co'
  },
  adveAdminApp: {
    databaseURL: 'https://adve-admin.firebaseio.com',
    projectId: 'adve-admin',
    storageBucket: 'adve-admin.appspot.com',
    websiteDomain: 'admin.advancedenglish.co'
  },
};

export const SANDBOX_APPS = {
  explearningPublicApp: {
    databaseURL: 'https://explearning-sandbox-public.firebaseio.com',
    projectId: 'explearning-sandbox-public',
    storageBucket: 'explearning-sandbox-public.appspot.com',
    websiteDomain: 'explearning-sandbox-public.firebaseapp.com'
  },
  explearningAdminApp: {
    databaseURL: 'https://explearning-sandbox-admin.firebaseio.com',
    projectId: 'explearning-sandbox-admin',
    storageBucket: 'explearning-sandbox-admin.appspot.com',
    websiteDomain: 'explearning-sandbox-admin.firebaseapp.com'
  },
  maryDaphnePublicApp: {
    databaseURL: 'https://marydaphne-sandbox-public.firebaseio.com',
    projectId: 'marydaphne-sandbox-public',
    storageBucket: 'marydaphne-sandbox-public.appspot.com',
    websiteDomain: 'marydaphne-sandbox-public.firebaseapp.com'
  },
  maryDaphneAdminApp: {
    databaseURL: 'https://marydaphne-sandbox-admin.firebaseio.com',
    projectId: 'marydaphne-sandbox-admin',
    storageBucket: 'marydaphne-sandbox-admin.appspot.com',
    websiteDomain: 'marydaphne-sandbox-admin.firebaseapp.com'
  },
  sywPublicApp: {
    databaseURL: 'https://syw-sandbox-public.firebaseio.com',
    projectId: 'syw-sandbox-public',
    storageBucket: 'syw-sandbox-public.appspot.com',
    websiteDomain: 'syw-sandbox-public.firebaseapp.com'
  },
  sywAdminApp: {
    databaseURL: 'https://syw-sandbox-admin.firebaseio.com',
    projectId: 'syw-sandbox-admin',
    storageBucket: 'syw-sandbox-admin.appspot.com',
    websiteDomain: 'syw-sandbox-admin.firebaseapp.com'
  },
  advePublicApp: {
    databaseURL: 'https://adve-sandbox-public.firebaseio.com',
    projectId: 'adve-sandbox-public',
    storageBucket: 'adve-sandbox-public.appspot.com',
    websiteDomain: 'adve-sandbox-public.firebaseapp.com'
  },
  adveAdminApp: {
    databaseURL: 'https://adve-sandbox-admin.firebaseio.com',
    projectId: 'adve-sandbox-admin',
    storageBucket: 'adve-sandbox-admin.appspot.com',
    websiteDomain: 'adve-sandbox-admin.firebaseapp.com'
  },
};

export enum ProductionCloudStorage {
  EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF = 'explearning-admin-blog',
  EXPLEARNING_ADMIN_BLOG_STORAGE_FB = 'gs://explearning-admin-blog',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-admin-products',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-admin-products',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-admin-backup',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-admin-backup',
  MARY_DAPHNE_ADMIN_BLOG_STORAGE_AF_CF = 'marydaphne-admin-blog',
  MARY_DAPHNE_ADMIN_BLOG_STORAGE_FB = 'gs://marydaphne-admin-blog',
  MARY_DAPHNE_ADMIN_PRODUCTS_STORAGE_AF_CF = 'marydaphne-admin-products',
  MARY_DAPHNE_ADMIN_PRODUCTS_STORAGE_FB = 'gs://marydaphne-admin-products',
  MARY_DAPHNE_ADMIN_BACKUP_STORAGE_AF_CF = 'marydaphne-admin-backup',
  MARY_DAPHNE_ADMIN_BACKUP_STORAGE_FB = 'gs://marydaphne-admin-backup',
  SYW_ADMIN_BLOG_STORAGE_AF_CF = 'syw-admin-blog',
  SYW_ADMIN_BLOG_STORAGE_FB = 'gs://syw-admin-blog',
  SYW_ADMIN_PRODUCTS_STORAGE_AF_CF = 'syw-admin-products',
  SYW_ADMIN_PRODUCTS_STORAGE_FB = 'gs://syw-admin-products',
  SYW_ADMIN_BACKUP_STORAGE_AF_CF = 'syw-admin-backup',
  SYW_ADMIN_BACKUP_STORAGE_FB = 'gs://syw-admin-backup',
  ADVE_ADMIN_BLOG_STORAGE_AF_CF = 'adve-admin-blog',
  ADVE_ADMIN_BLOG_STORAGE_FB = 'gs://adve-admin-blog',
  ADVE_ADMIN_PRODUCTS_STORAGE_AF_CF = 'adve-admin-products',
  ADVE_ADMIN_PRODUCTS_STORAGE_FB = 'gs://adve-admin-products',
  ADVE_ADMIN_BACKUP_STORAGE_AF_CF = 'adve-admin-backup',
  ADVE_ADMIN_BACKUP_STORAGE_FB = 'gs://adve-admin-backup',
}

export enum SandboxCloudStorage {
  EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF = 'explearning-sandbox-admin-blog',
  EXPLEARNING_ADMIN_BLOG_STORAGE_FB = 'gs://explearning-sandbox-admin-blog',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-sandbox-admin-products',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-sandbox-admin-products',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-sandbox-admin-backup',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-sandbox-admin-backup',
  MARY_DAPHNE_ADMIN_BLOG_STORAGE_AF_CF = 'marydaphne-sandbox-admin-blog',
  MARY_DAPHNE_ADMIN_BLOG_STORAGE_FB = 'gs://marydaphne-sandbox-admin-blog',
  MARY_DAPHNE_ADMIN_PRODUCTS_STORAGE_AF_CF = 'marydaphne-sandbox-admin-products',
  MARY_DAPHNE_ADMIN_PRODUCTS_STORAGE_FB = 'gs://marydaphne-sandbox-admin-products',
  MARY_DAPHNE_ADMIN_BACKUP_STORAGE_AF_CF = 'marydaphne-sandbox-admin-backup',
  MARY_DAPHNE_ADMIN_BACKUP_STORAGE_FB = 'gs://marydaphne-sandbox-admin-backup',
  SYW_ADMIN_BLOG_STORAGE_AF_CF = 'syw-sandbox-admin-blog',
  SYW_ADMIN_BLOG_STORAGE_FB = 'gs://syw-sandbox-admin-blog',
  SYW_ADMIN_PRODUCTS_STORAGE_AF_CF = 'syw-sandbox-admin-products',
  SYW_ADMIN_PRODUCTS_STORAGE_FB = 'gs://syw-sandbox-admin-products',
  SYW_ADMIN_BACKUP_STORAGE_AF_CF = 'syw-sandbox-admin-backup',
  SYW_ADMIN_BACKUP_STORAGE_FB = 'gs://syw-sandbox-admin-backup',
  ADVE_ADMIN_BLOG_STORAGE_AF_CF = 'adve-sandbox-admin-blog',
  ADVE_ADMIN_BLOG_STORAGE_FB = 'gs://adve-sandbox-admin-blog',
  ADVE_ADMIN_PRODUCTS_STORAGE_AF_CF = 'adve-sandbox-admin-products',
  ADVE_ADMIN_PRODUCTS_STORAGE_FB = 'gs://adve-sandbox-admin-products',
  ADVE_ADMIN_BACKUP_STORAGE_AF_CF = 'adve-sandbox-admin-backup',
  ADVE_ADMIN_BACKUP_STORAGE_FB = 'gs://adve-sandbox-admin-backup',
}

// Currently all apps use the Explearning keys
export enum StripePublishableKeys {
  EXPLEARNING_PROD = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F',
  EXPLEARNING_SANDBOX = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH',
  MARY_DAPHNE_PROD = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F',
  MARY_DAPHNE_SANDBOX = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH',
  SYW_PROD = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F',
  SYW_SANDBOX = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH',
  ADVE_PROD = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F',
  ADVE_SANDBOX = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH',
}

export enum ProductionSsrDataLoadChecks {
  EXPLEARNING_BLOG_MIN = 39,
  EXPLEARNING_PODCAST_MIN = 39,
  MARY_DAPHNE_BLOG_MIN = 14,
  MARY_DAPHNE_PODCAST_MIN = 0,
  SYW_BLOG_MIN = 20,
  SYW_PODCAST_MIN = 20,
  ADVE_BLOG_MIN = 1,
  ADVE_PODCAST_MIN = 1,
}

export enum SandboxSsrDataLoadChecks {
  EXPLEARNING_BLOG_MIN = 2,
  EXPLEARNING_PODCAST_MIN = 2,
  MARY_DAPHNE_BLOG_MIN = 1,
  MARY_DAPHNE_PODCAST_MIN = 0,
  SYW_BLOG_MIN = 2,
  SYW_PODCAST_MIN = 2,
  ADVE_BLOG_MIN = 2,
  ADVE_PODCAST_MIN = 2
}
