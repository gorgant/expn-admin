import { SubSourceProductIdReferenceList, SubscriptionSource } from '../subscribers/subscription-source.model';

export enum ProductIdList {
  EXPN_REMOTE_COACH = '907jvhn4',
  EXPN_EXECUTIVE_PRESENCE = 'ko8wpx0c',
  EXPN_REMOTE_WORK = 'v7h7td9h',
  EXPN_ONLINE_INTERVIEWS = 'oemqpck1',
  EXPN_GROUP_INTERVIEWS = 'bug3hcqp',
  EXPN_ONLINE_TEAMWORK = 'kzu1v20b',
  MDLS_REMOTE_COACH = '5fff82ic',
  MDLS_EXECUTIVE_PRESENCE = 'oos6fw69',
  MDLS_REMOTE_WORK = 'qo17xor5',
  MDLS_ONLINE_INTERVIEWS = 'fapjp8i0',
  MDLS_GROUP_INTERVIEWS = 'gfjrmdhq',
  MDLS_ONLINE_TEAMWORK = '60j6rl1n',
  SYW_REMOTE_COACH = 'hohk65sp',
  SYW_EXECUTIVE_PRESENCE = 'tbj97azw',
  SYW_REMOTE_WORK = 'dgp28sgc',
  SYW_ONLINE_INTERVIEWS = 'cwdazfbw',
  SYW_GROUP_INTERVIEWS = 'm0w4qx1n',
  SYW_ONLINE_TEAMWORK = 'jjfmkxlk',
  ADVE_REMOTE_COACH = '7us06f84',
  ADVE_EXECUTIVE_PRESENCE = 'o4u9lkpk',
  ADVE_REMOTE_WORK = 'brhfsfff',
  ADVE_ONLINE_INTERVIEWS = '68sieci0',
  ADVE_GROUP_INTERVIEWS = 'ebgyik3s',
  ADVE_ONLINE_TEAMWORK = 'hh7m8i1q',
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
  [ProductIdList.EXPN_REMOTE_COACH]: {
    productId: ProductIdList.EXPN_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.EXPN_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.EXPN_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.EXPN_REMOTE_WORK]: {
    productId: ProductIdList.EXPN_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.EXPN_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.EXPN_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.EXPN_GROUP_INTERVIEWS]: {
    productId: ProductIdList.EXPN_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.EXPN_ONLINE_TEAMWORK]: {
    productId: ProductIdList.EXPN_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.MDLS_REMOTE_COACH]: {
    productId: ProductIdList.MDLS_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.MDLS_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.MDLS_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPN_EXECUTIVE_PRESENCE
  },
  [ProductIdList.MDLS_REMOTE_WORK]: {
    productId: ProductIdList.MDLS_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPN_REMOTE_WORK
  },
  [ProductIdList.MDLS_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.MDLS_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_ONLINE_INTERVIEWS
  },
  [ProductIdList.MDLS_GROUP_INTERVIEWS]: {
    productId: ProductIdList.MDLS_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_GROUP_INTERVIEWS
  },
  [ProductIdList.MDLS_ONLINE_TEAMWORK]: {
    productId: ProductIdList.MDLS_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPN_ONLINE_TEAMWORK
  },
  [ProductIdList.SYW_REMOTE_COACH]: {
    productId: ProductIdList.SYW_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.SYW_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.SYW_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPN_EXECUTIVE_PRESENCE
  },
  [ProductIdList.SYW_REMOTE_WORK]: {
    productId: ProductIdList.SYW_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPN_REMOTE_WORK
  },
  [ProductIdList.SYW_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.SYW_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_ONLINE_INTERVIEWS
  },
  [ProductIdList.SYW_GROUP_INTERVIEWS]: {
    productId: ProductIdList.SYW_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_GROUP_INTERVIEWS
  },
  [ProductIdList.SYW_ONLINE_TEAMWORK]: {
    productId: ProductIdList.SYW_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPN_ONLINE_TEAMWORK
  },
  [ProductIdList.ADVE_REMOTE_COACH]: {
    productId: ProductIdList.ADVE_REMOTE_COACH,
    productUrlSlug: ProductUrlSlugList.REMOTE_COACH,
    masterProductRef: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.ADVE_EXECUTIVE_PRESENCE]: {
    productId: ProductIdList.ADVE_EXECUTIVE_PRESENCE,
    productUrlSlug: ProductUrlSlugList.EXECUTIVE_PRESENCE,
    masterProductRef: ProductIdList.EXPN_EXECUTIVE_PRESENCE
  },
  [ProductIdList.ADVE_REMOTE_WORK]: {
    productId: ProductIdList.ADVE_REMOTE_WORK,
    productUrlSlug: ProductUrlSlugList.REMOTE_WORK,
    masterProductRef: ProductIdList.EXPN_REMOTE_WORK
  },
  [ProductIdList.ADVE_ONLINE_INTERVIEWS]: {
    productId: ProductIdList.ADVE_ONLINE_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.ONLINE_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_ONLINE_INTERVIEWS
  },
  [ProductIdList.ADVE_GROUP_INTERVIEWS]: {
    productId: ProductIdList.ADVE_GROUP_INTERVIEWS,
    productUrlSlug: ProductUrlSlugList.GROUP_INTERVIEWS,
    masterProductRef: ProductIdList.EXPN_GROUP_INTERVIEWS
  },
  [ProductIdList.ADVE_ONLINE_TEAMWORK]: {
    productId: ProductIdList.ADVE_ONLINE_TEAMWORK,
    productUrlSlug: ProductUrlSlugList.ONLINE_TEAMWORK,
    masterProductRef: ProductIdList.EXPN_ONLINE_TEAMWORK
  },
};

// Used for managing waitlist contact lists on sendgrid
export const SubSourceProductIdReferences: SubSourceProductIdReferenceList = {
  [ProductIdList.EXPN_EXECUTIVE_PRESENCE]: {
    subSource: SubscriptionSource.WAIT_LIST_EXECUTIVE_PRESENCE,
    productId: ProductIdList.EXPN_EXECUTIVE_PRESENCE
  },
  [ProductIdList.EXPN_REMOTE_WORK]: {
    subSource: SubscriptionSource.WAIT_LIST_REMOTE_WORK,
    productId: ProductIdList.EXPN_REMOTE_WORK
  }
};
