import { ProductIdList } from '../products/product-id-list.model';
import { ProductEmailTemplateList } from './product-email-template.model';

export enum EmailCategories {
  OPT_IN_CONFIRMATION = 'opt-in-confirmation',
  WELCOME_EMAIL = 'welcome-email',
  CONTACT_FORM_CONFIRMATION = 'contact-form-confirmation',
  PURCHASE_CONFIRMATION = 'purchase-confirmation',
  TEST_SEND = 'test-send',
  MARKETING_NEWSLETTER = 'marketing-newsletter',
  WEBPAGE_DATA_LOAD_FAILURE = 'webpage-data-load-failure'
}

// Ids sourced from Sendgrid template system
export enum EmailTemplateIds {
  EXPLEARNING_WELCOME_EMAIL = 'd-7327446fd2714cf0a605884dc9ce67fa',
  EXPLEARNING_OPT_IN_CONFIRMATION = 'd-b6beec26f3d644e3b4eafc4213d281db',
  EXPLEARNING_CONTACT_FORM_CONFIRMATION = 'd-0dbb4cd9b1a74e6faf8a62d2765046f2',
  EXPLEARNING_REMOTE_COACH_PURCHASE_CONFIRMATION = 'd-ee7b672fe47a4570b9ad381486604a1d',
  MARY_DAPHNE_WELCOME_EMAIL = 'd-1d5174c867e445be9fc4f4eaed7bc241',
  MARY_DAPHNE_OPT_IN_CONFIRMATION = 'd-ff70ac624ec243e789efa74b0411f971',
  MARY_DAPHNE_CONTACT_FORM_CONFIRMATION = 'd-68ffed5939564e2181e07f17b1380869',
}

export enum EmailContactListIds {
  EXPLEARNING_COMMUNICATIONS_STRATEGIES = '12e2e831-4713-458f-a103-f96bc48c314b',
  EXPLEARNING_EXECUTIVE_PRESENCE_WAIT_LIST = 'f3bb8e68-537c-45ad-8fc4-7116ea2db470',
  EXPLEARNING_REMOTE_WORK_WAIT_LIST = 'cb970561-2b4c-435f-82e4-4665cdc37de6',
  MARY_DAPHNE_COMMUNICATIONS_STRATEGIES = 'e0b66287-629c-4365-b1ed-fbec6f71db67',
  MARY_DAPHNE_EXECUTIVE_PRESENCE_WAIT_LIST = 'cbb8f762-6fb9-4b3d-8427-00f1b9d26a80',
  MARY_DAPHNE_REMOTE_WORK_WAIT_LIST = 'a0426571-77ea-45a4-ac96-a0668904282d',
}

export enum EmailUnsubscribeGroupIds {
  EXPLEARNING_COMMUNICATIONS_STRATEGIES = 13988,
  EXPLEARNING_EXECUTIVE_PRESENCE_WAIT_LIST = 15125,
  EXPLEARNING_REMOTE_WORK_WAIT_LIST = 15126,
  MARY_DAPHNE_COMMUNICATIONS_STRATEGIES = 10012,
  MARY_DAPHNE_EXECUTIVE_PRESENCE_WAIT_LIST = 13699,
  MARY_DAPHNE_REMOTE_WORK_WAIT_LIST = 13700
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
  EXPLEARNING_ADMIN = 'admin@explearning.co',
  EXPLEARNING_SUPPORT = 'support@explearning.co',
  MARY_DAPHNE_DEFAULT = 'hello@marydaphne.com',
  MARY_DAPHNE_NEWSLETTER = 'newsletter@marydaphne.com',
  MARY_DAPHNE_ORDERS = 'orders@marydaphne.com',
  MARY_DAPHNE_ADMIN = 'admin@marydaphne.com',
  MARY_DAPHNE_SUPPORT = 'support@marydaphne.com'
}

export enum EmailSenderNames {
  EXPLEARNING_DEFAULT = 'Explearning',
  EXPLEARNING_NEWSLETTER = 'Mary Daphne with Explearning',
  EXPLEARNING_ADMIN = 'Explearning ADMIN',
  MARY_DAPHNE_DEFAULT = 'Mary Daphne',
  MARY_DAPHNE_NEWSLETTER = 'Mary Daphne',
  MARY_DAPHNE_ADMIN = 'Mary Daphne ADMIN'
}

export const AdminEmailAddresses = {
  EXPLEARNING_GREG_ONLY: 'greg@explearning.co',
  EXPLEARNING_GREG_AND_MD: ['greg@explearning.co, md@explearning.co'],
  EXPLEARNING_DEFAULT: 'default@explearning.co',
  MARY_DAPHNE_GREG_ONLY: 'greg@marydaphne.com',
  MARY_DAPHNE_GREG_AND_MD: ['greg@marydaphne.com, md@marydaphne.com'],
  MARY_DAPHNE_DEFAULT: 'default@marydaphne.com'
};
