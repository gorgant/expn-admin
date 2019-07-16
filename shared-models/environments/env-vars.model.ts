export enum EnvironmentTypes {
  SANDBOX = 'sandbox',
  PRODUCTION = 'production'
}

export const PRODUCTION_APPS = {
  publicApp: {
    databaseURL: 'https://explearning-76d93.firebaseio.com',
    projectId: 'explearning-76d93',
    storageBucket: 'explearning-76d93.appspot.com',
    websiteDomain: 'myexplearning.com'
  },
  adminApp: {
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
  }
};

export const SANDBOX_APPS = {
  publicApp: {
    databaseURL: 'https://explearning-sandbox-public.firebaseio.com',
    projectId: 'explearning-sandbox-public',
    storageBucket: 'explearning-sandbox-public.appspot.com',
    websiteDomain: 'explearning-sandbox-public.firebaseapp.com'
  },
  adminApp: {
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
  }
};

export enum ProductionCloudStorage {
  ADMIN_BLOG_STORAGE_AF_CF = 'explearning-admin-blog',
  ADMIN_BLOG_STORAGE_FB = 'gs://explearning-admin-blog',
  ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-admin-products',
  ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-admin-products',
  ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-admin-backup',
  ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-admin-backup',
}

export enum SandboxCloudStorage {
  ADMIN_BLOG_STORAGE_AF_CF = 'explearning-sandbox-admin-blog',
  ADMIN_BLOG_STORAGE_FB = 'gs://explearning-sandbox-admin-blog',
  ADMIN_PRODUCTS_STORAGE_AF_CF = 'explearning-sandbox-admin-products',
  ADMIN_PRODUCTS_STORAGE_FB = 'gs://explearning-sandbox-admin-products',
  ADMIN_BACKUP_STORAGE_AF_CF = 'explearning-sandbox-admin-backup',
  ADMIN_BACKUP_STORAGE_FB = 'gs://explearning-sandbox-admin-backup',
}

export enum ProductionStripePublishableKeys {
  PUBLISHABLE = 'pk_live_2ybMSK15jNXw8mpoJ1MmIrfW00PvuSsi2F'
}

export enum SandboxStripePublishableKeys {
  PUBLISHABLE = 'pk_test_qiAhFPd39eG3eqgEtWM9Yx0v00p7PxdzcH'
}
