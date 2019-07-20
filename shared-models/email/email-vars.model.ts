import { ProductIdList } from '../products/product-id-list.model';
import { ProductEmailTemplateList } from './product-email-template.model';

export enum EmailCategories {
  SUBSCRIPTION_CONFIRMATION = 'subscription-confirmation',
  CONTACT_FORM_CONFIRMATION = 'contact-form-confirmation',
  PURCHASE_CONFIRMATION = 'purchase-confirmation',
  TEST_SEND = 'test-send'
}

// Ids sourced from Sendgrid template system
export enum EmailTemplateIds {
  EXPLEARNING_SUBSCRIPTION_CONFIRMATION = 'd-a5178c4ee40244649122e684d244f6cc',
  EXPLEARNING_CONTACT_FORM_CONFIRMATION = 'd-c333f6f223d24ba8925e35e08caa37b5',
  EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION = 'd-a1dd923aa818453d8de0b30253af7a05',
  MARY_DAPHNE_SUBSCRIPTION_CONFIRMATION = 'd-1d5174c867e445be9fc4f4eaed7bc241',
  MARY_DAPHNE_CONTACT_FORM_CONFIRMATION = 'd-68ffed5939564e2181e07f17b1380869',
}

export enum EmailUnsubscribeGroupIds {
  EXPLEARNING_COMMUNICATIONS_STRATEGIES = 10288,
  MARY_DAPHNE_COMMUNICATIONS_STRATEGIES = 10012,
}

// Set the key to the Product ID Searchable by product ID
// For now the MD products will use the Explearning email template
export const ProductEmailTemplates: ProductEmailTemplateList = {
  [ProductIdList.EXPLEARNING_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.EXPLEARNING_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH
  },
  [ProductIdList.EXPLEARNING_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.EXPLEARNING_SANDBOX_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.MARY_DAPHNE_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH
  },
  [ProductIdList.MARY_DAPHNE_SANDBOX_ANOTHER_COOL_PRODUCT]: {
    templateId: EmailTemplateIds.EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.MARY_DAPHNE_SANDBOX_REMOTE_COACH
  }
};

export enum EmailSenderAddresses {
  EXPLEARNING_DEFAULT = 'hello@myexplearning.com',
  EXPLEARNING_ORDERS = 'orders@myexplearning.com',
  MARY_DAPHNE_DEFAULT = 'hello@marydaphne.com',
  MARY_DAPHNE_ORDERS = 'orders@marydaphne.com'
}

export enum EmailSenderNames {
  EXPLEARNING_DEFAULT = 'Explearning',
  MARY_DAPHNE_DEFAULT = 'Mary Daphne'
}

export const AdminEmailAddresses = {
  EXPLEARNING_GREG_ONLY: 'greg@myexplearning.com',
  EXPLEARNING_GREG_AND_MD: ['greg@myexplearning.com, marydaphne@myexplearning.com'],
  MARY_DAPHNE_GREG_ONLY: 'greg@marydaphne.com',
  MARY_DAPHNE_GREG_AND_MD: ['greg@marydaphne.com, marydaphne@marydaphne.com']
};
