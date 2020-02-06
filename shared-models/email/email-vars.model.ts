import { ProductIdList } from '../products/product-id-list.model';
import { ProductEmailTemplateList } from './product-email-template.model';

export enum EmailCategories {
  SUBSCRIPTION_CONFIRMATION = 'subscription-confirmation',
  CONTACT_FORM_CONFIRMATION = 'contact-form-confirmation',
  PURCHASE_CONFIRMATION = 'purchase-confirmation',
  TEST_SEND = 'test-send',
  MARKETING_NEWSLETTER = 'marketing-newsletter'
}

// Ids sourced from Sendgrid template system
export enum EmailTemplateIds {
  EXPLEARNING_SUBSCRIPTION_CONFIRMATION = 'd-7327446fd2714cf0a605884dc9ce67fa',
  EXPLEARNING_CONTACT_FORM_CONFIRMATION = 'd-0dbb4cd9b1a74e6faf8a62d2765046f2',
  EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION = 'd-ee7b672fe47a4570b9ad381486604a1d',
  MARY_DAPHNE_SUBSCRIPTION_CONFIRMATION = 'd-1d5174c867e445be9fc4f4eaed7bc241',
  MARY_DAPHNE_CONTACT_FORM_CONFIRMATION = 'd-68ffed5939564e2181e07f17b1380869',
}

export enum EmailContactListIds {
  EXPLEARNING_COMMUNICATIONS_STRATEGIES = '12e2e831-4713-458f-a103-f96bc48c314b'
}

export enum EmailUnsubscribeGroupIds {
  EXPLEARNING_COMMUNICATIONS_STRATEGIES = 13988,
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
  EXPLEARNING_DEFAULT = 'hello@explearning.co',
  EXPLEARNING_NEWSLETTER = 'newsletter@explearning.co',
  EXPLEARNING_ORDERS = 'orders@explearning.co',
  MARY_DAPHNE_DEFAULT = 'hello@marydaphne.com',
  MARY_DAPHNE_NEWSLETTER = 'newsletter@marydaphne.co',
  MARY_DAPHNE_ORDERS = 'orders@marydaphne.com'
}

export enum EmailSenderNames {
  EXPLEARNING_DEFAULT = 'Explearning',
  EXPLEARNING_NEWSLETTER = 'Mary Daphne with Explearning',
  MARY_DAPHNE_DEFAULT = 'Mary Daphne',
  MARY_DAPHNE_NEWSLETTER = 'Mary Daphne'
}

export const AdminEmailAddresses = {
  EXPLEARNING_GREG_ONLY: 'greg@explearning.co',
  EXPLEARNING_GREG_AND_MD: ['greg@explearning.co, md@explearning.co'],
  EXPLEARNING_DEFAULT: 'default@explearning.co',
  MARY_DAPHNE_GREG_ONLY: 'greg@marydaphne.com',
  MARY_DAPHNE_GREG_AND_MD: ['greg@marydaphne.com, md@marydaphne.com'],
  MARY_DAPHNE_DEFAULT: 'default@marydaphne.com'
};
