import { SubSourceProductIdReferenceList, SubscriptionSource } from '../subscribers/subscription-source.model';

export enum ProductIdList {
  EXPLEARNING_REMOTE_COACH = '907jvhn4',
  EXPLEARNING_EXECUTIVE_PRESENCE = 'ko8wpx0c',
  EXPLEARNING_REMOTE_WORK = 'v7h7td9h',
  EXPLEARNING_SANDBOX_REMOTE_COACH = 'oq0moyim',
  EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT = 'fpfh8wi9',
  EXPLEARNING_SANDBOX_WEB_COURSE = 'wq7jg75d',
  EXPLEARNING_SANDBOX_REMOTE_WORK = 'oekbxuwf',
  MARY_DAPHNE_REMOTE_COACH = '5fff82ic',
  MARY_DAPHNE_EXECUTIVE_PRESENCE = 'oos6fw69',
  MARY_DAPHNE_REMOTE_WORK = 'qo17xor5',
  MARY_DAPHNE_SANDBOX_REMOTE_COACH = 'z37kqtvl',
  MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT = 'ml2ke0ak',
  MARY_DAPHNE_SANDBOX_WEB_COURSE = 'z3iiar4t',
  MARY_DAPHNE_SANDBOX_REMOTE_WORK = 'g1rjuj81'
}

export enum ProductUrlSlugList {
  REMOTE_COACH = 'remote-coach',
  EXECUTIVE_PRESENCE = 'executive-presence:-unlock-the-leader-within',
  REMOTE_WORK = 'remote-work-mastery:-work-from-home-or-anywhere',
  SANDBOX_REMOTE_COACH = 'sandbox-remote-coach',
  SANDBOX_ANOTHER_COOL_PRODUCT = 'sandbox-another-cool-product',
  SANDBOX_WEB_COURSE = 'sandbox-executive-presence:-unlock-the-leader-within',
  SANDBOX_REMOTE_WORK = 'sandbox-remote-work-mastery:-work-from-home-or-anywhere'
}

// The Product/Template pair
export interface ProductReference {
  productId: string;
  productUrlSlug: string;
  mdOrExpSisterProduct: string;
}

// The object containing any number of Product/Template pairs
export interface ProductReferenceList {
  [key: string]: ProductReference;
}

// Set the key to the Product ID Searchable by product ID
export const ProductReferenceList: ProductReferenceList = {
  [ProductIdList.EXPLEARNING_REMOTE_COACH]: {
    productId: ProductIdList.EXPLEARNING_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE
  },
  [ProductIdList.EXPLEARNING_REMOTE_WORK]: {
    productId: ProductIdList.EXPLEARNING_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_REMOTE_WORK
  },
  [ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_COACH,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT,
    productUrlSlug: ProductUrlSlugList.SANDBOX_ANOTHER_COOL_PRODUCT,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT
  },
  [ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE,
    productUrlSlug: ProductUrlSlugList.SANDBOX_WEB_COURSE,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_SANDBOX_WEB_COURSE
  },
  [ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK]: {
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_WORK,
    mdOrExpSisterProduct: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_WORK
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_COACH]: {
    productId: ProductIdList.MARY_DAPHNE_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_WORK]: {
    productId: ProductIdList.MARY_DAPHNE_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_REMOTE_WORK
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_COACH,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH,
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT,
    productUrlSlug: ProductUrlSlugList.SANDBOX_ANOTHER_COOL_PRODUCT,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_WEB_COURSE]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_WEB_COURSE,
    productUrlSlug: ProductUrlSlugList.SANDBOX_WEB_COURSE,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_WORK]: {
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.SANDBOX_REMOTE_WORK,
    mdOrExpSisterProduct: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK
  },
};

// Used for managing waitlist contact lists on sendgrid
export const SubSourceProductIdReferences: SubSourceProductIdReferenceList = {
  [ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE]: {
    subSource: SubscriptionSource.WAIT_LIST_EXECUTIVE_PRESENCE,
    productId: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE
  },
  [ProductIdList.EXPLEARNING_REMOTE_WORK]: {
    subSource: SubscriptionSource.WAIT_LIST_REMOTE_WORK,
    productId: ProductIdList.EXPLEARNING_REMOTE_WORK
  },
  [ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE]: {
    subSource: SubscriptionSource.WAIT_LIST_EXECUTIVE_PRESENCE,
    productId: ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE
  },
  [ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK]: {
    subSource: SubscriptionSource.WAIT_LIST_REMOTE_WORK,
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK
  },
  [ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE]: {
    subSource: SubscriptionSource.WAIT_LIST_EXECUTIVE_PRESENCE,
    productId: ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_WORK]: {
    subSource: SubscriptionSource.WAIT_LIST_REMOTE_WORK,
    productId: ProductIdList.MARY_DAPHNE_REMOTE_WORK
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_WEB_COURSE]: {
    subSource: SubscriptionSource.WAIT_LIST_EXECUTIVE_PRESENCE,
    productId: ProductIdList.EXPLEARNING_SANDBOX_WEB_COURSE
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_WORK]: {
    subSource: SubscriptionSource.WAIT_LIST_REMOTE_WORK,
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_WORK
  }
};
