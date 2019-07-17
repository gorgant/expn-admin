export enum EnvironmentTypes {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

export const PRODUCTION_APPS = {
  explearningPublicApp: {
    databaseURL: 'https://explearning-76d93.firebaseio.com',
    projectId: 'explearning-76d93',
    storageBucket: 'explearning-76d93.appspot.com',
    websiteDomain: 'myexplearning.com'
  },
  explearningAdminApp: {
    databaseURL: 'https://explearning-admin.firebaseio.com',
    projectId: 'explearning-admin',
    storageBucket: 'explearning-admin.appspot.com',
    websiteDomain: 'admin.myexplearning.com'
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
  }
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
  }
};

export enum ProductionCloudStorage {
  EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF = 'explearning-admin-blog',
  EXPLEARNING_ADMIN_BLOG_STORAGE_FB = 'gs://explearning-admin-blog',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-admin-products',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-admin-products',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-admin-backup',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-admin-backup',
}

export enum SandboxCloudStorage {
  EXPLEARNING_ADMIN_BLOG_STORAGE_AF_CF = 'explearning-sandbox-admin-blog',
  EXPLEARNING_ADMIN_BLOG_STORAGE_FB = 'gs://explearning-sandbox-admin-blog',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-sandbox-admin-products',
  EXPLEARNING_ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-sandbox-admin-products',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-sandbox-admin-backup',
  EXPLEARNING_ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-sandbox-admin-backup',
}

export enum ProductionStripePublishableKeys {
  PUBLISHABLE = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F'
}

export enum SandboxStripePublishableKeys {
  PUBLISHABLE = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH'
}
