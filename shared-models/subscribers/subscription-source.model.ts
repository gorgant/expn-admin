export enum SubscriptionSource {
  WEBSITE_BOX = 'website-box',
  POPUP_SMALLTALK = 'popup-smalltalk',
  CHECKOUT = 'checkout',
  CONTACT_FORM = 'contact-form',
  CONTACT_FORM_NO_SUB = 'contact-form-no-sub',
  WAIT_LIST_EXECUTIVE_PRESENCE = 'wait-list-executive-presence',
  WAIT_LIST_REMOTE_WORK = 'wait-list-remote-work'
}

export interface SubSourceProductIdReference {
  subSource: SubscriptionSource;
  productId: string;
}

export interface SubSourceProductIdReferenceList {
  [key: string]: SubSourceProductIdReference;
}
