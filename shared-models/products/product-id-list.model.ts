import { SubSourceProductIdReferenceList, SubscriptionSource } from '../subscribers/subscription-source.model';

export enum ProductIdList {
  EXPLEARNING_REMOTE_COACH = '907jvhn4',
  EXPLEARNING_EXECUTIVE_PRESENCE = 'ko8wpx0c',
  EXPLEARNING_REMOTE_WORK = 'v7h7td9h',
  EXPLEARNING_ONLINE_INTERVIEWS = 'oemqpck1',
  EXPLEARNING_GROUP_INTERVIEWS = 'bug3hcqp',
  EXPLEARNING_ONLINE_TEAMWORK = 'kzu1v20b',
  MARY_DAPHNE_REMOTE_COACH = '5fff82ic',
  MARY_DAPHNE_EXECUTIVE_PRESENCE = 'oos6fw69',
  MARY_DAPHNE_REMOTE_WORK = 'qo17xor5',
  MARY_DAPHNE_ONLINE_INTERVIEWS = 'fapjp8i0',
  MARY_DAPHNE_GROUP_INTERVIEWS = 'gfjrmdhq',
  MARY_DAPHNE_ONLINE_TEAMWORK = '60j6rl1n',
  SYW_REMOTE_COACH = 'hohk65sp',
  SYW_EXECUTIVE_PRESENCE = 'tbj97azw',
  SYW_REMOTE_WORK = 'dgp28sgc',
  SYW_ONLINE_INTERVIEWS = 'cwdazfbw',
  SYW_GROUP_INTERVIEWS = 'm0w4qx1n',
  SYW_ONLINE_TEAMWORK = 'jjfmkxlk'
}

export enum ProductUrlSlugList {
  REMOTE_COACH = 'remote-coach',
  EXECUTIVE_PRESENCE = 'executive-presence:-unlock-the-leader-within',
  REMOTE_WORK = 'remote-work-for-professionals-and-managers:-work-from-home-or-anywhere',
  ONLINE_INTERVIEWS = 'acing-online-interviews-on-zoom,-skype,-and-video-calls',
  GROUP_INTERVIEWS = 'group-interviews:-how-to-stand-out-in-a-crowd-and-influence-people',
  ONLINE_TEAMWORK = 'online-teamwork:-manage-remote-teams-&-master-remote-collaboration'
}

// The Product/Template pair
export interface ProductReference {
  productId: string;
  productUrlSlug: string;
  masterProductRef: string;
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
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_REMOTE_WORK]: {
    productId: ProductIdList.EXPLEARNING_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.EXPLEARNING_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_GROUP_INTERVIEWS]: {
    productId: ProductIdList.EXPLEARNING_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_ONLINE_TEAMWORK]: {
    productId: ProductIdList.EXPLEARNING_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_COACH]: {
    productId: ProductIdList.MARY_DAPHNE_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.MARY_DAPHNE_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_WORK]: {
    productId: ProductIdList.MARY_DAPHNE_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_WORK
  },
  [ProductIdList.MARY_DAPHNE_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.MARY_DAPHNE_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_ONLINE_INTERVIEWS
  },
  [ProductIdList.MARY_DAPHNE_GROUP_INTERVIEWS]: {
    productId: ProductIdList.MARY_DAPHNE_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_GROUP_INTERVIEWS
  },
  [ProductIdList.MARY_DAPHNE_ONLINE_TEAMWORK]: {
    productId: ProductIdList.MARY_DAPHNE_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPLEARNING_ONLINE_TEAMWORK
  },
  [ProductIdList.SYW_REMOTE_COACH]: {
    productId: ProductIdList.SYW_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.SYW_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.SYW_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPLEARNING_EXECUTIVE_PRESENCE
  },
  [ProductIdList.SYW_REMOTE_WORK]: {
    productId: ProductIdList.SYW_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPLEARNING_REMOTE_WORK
  },
  [ProductIdList.SYW_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.SYW_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_ONLINE_INTERVIEWS
  },
  [ProductIdList.SYW_GROUP_INTERVIEWS]: {
    productId: ProductIdList.SYW_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPLEARNING_GROUP_INTERVIEWS
  },
  [ProductIdList.SYW_ONLINE_TEAMWORK]: {
    productId: ProductIdList.SYW_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPLEARNING_ONLINE_TEAMWORK
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
  }
};
