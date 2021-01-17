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
  EXPN_WELCOME_EMAIL = 'd-7327446fd2714cf0a605884dc9ce67fa',
  EXPN_OPT_IN_CONFIRMATION = 'd-b6beec26f3d644e3b4eafc4213d281db',
  EXPN_CONTACT_FORM_CONFIRMATION = 'd-0dbb4cd9b1a74e6faf8a62d2765046f2',
  EXPN_REMOTE_COACH_PURCHASE_CONFIRMATION = 'd-ee7b672fe47a4570b9ad381486604a1d',
  MDLS_WELCOME_EMAIL = 'd-1d5174c867e445be9fc4f4eaed7bc241',
  MDLS_OPT_IN_CONFIRMATION = 'd-ff70ac624ec243e789efa74b0411f971',
  MDLS_CONTACT_FORM_CONFIRMATION = 'd-68ffed5939564e2181e07f17b1380869',
  SYW_WELCOME_EMAIL = 'd-99c64a8b00364a6cb1af1fb9e0b16eac',
  SYW_OPT_IN_CONFIRMATION = 'd-776824ed40bf44efa371843d0073ec25',
  SYW_CONTACT_FORM_CONFIRMATION = 'd-e058fdbaa080487285a8391258a6ef08',
  ADVE_WELCOME_EMAIL = 'd-539dc1e2c38a4c14a16ba52a167bccb9',
  ADVE_OPT_IN_CONFIRMATION = 'd-278d02a459384530b9e71cb338e0046d',
  ADVE_CONTACT_FORM_CONFIRMATION = 'd-30ecd808839443f1a3b941c8e4a43d82',
}

export enum EmailContactListIds {
  EXPN_PRIMARY_NEWSLETTER = '12e2e831-4713-458f-a103-f96bc48c314b',
  EXPN_EXECUTIVE_PRESENCE_WAIT_LIST = 'f3bb8e68-537c-45ad-8fc4-7116ea2db470',
  EXPN_REMOTE_WORK_WAIT_LIST = 'cb970561-2b4c-435f-82e4-4665cdc37de6',
  MDLS_PRIMARY_NEWSLETTER = 'e0b66287-629c-4365-b1ed-fbec6f71db67',
  MDLS_EXECUTIVE_PRESENCE_WAIT_LIST = 'cbb8f762-6fb9-4b3d-8427-00f1b9d26a80',
  MDLS_REMOTE_WORK_WAIT_LIST = 'a0426571-77ea-45a4-ac96-a0668904282d',
  SYW_PRIMARY_NEWSLETTER = '422a87c7-66ce-469e-b614-81bab3b2c05c',
  SYW_EXECUTIVE_PRESENCE_WAIT_LIST = 'TBD',
  SYW_REMOTE_WORK_WAIT_LIST = 'TBD',
  ADVE_PRIMARY_NEWSLETTER = '4cd8cb6e-8ac4-433a-877d-829cf99be715',
  ADVE_EXECUTIVE_PRESENCE_WAIT_LIST = 'TBD',
  ADVE_REMOTE_WORK_WAIT_LIST = 'TBD',
}

export enum EmailUnsubscribeGroupIds {
  EXPN_PRIMARY_NEWSLETTER = 13988,
  EXPN_EXECUTIVE_PRESENCE_WAIT_LIST = 15125,
  EXPN_REMOTE_WORK_WAIT_LIST = 15126,
  MDLS_PRIMARY_NEWSLETTER = 10012,
  MDLS_EXECUTIVE_PRESENCE_WAIT_LIST = 13699,
  MDLS_REMOTE_WORK_WAIT_LIST = 13700,
  SYW_PRIMARY_NEWSLETTER = 22515,
  ADVE_PRIMARY_NEWSLETTER = 17226,
}

// Set the key to the Product ID Searchable by product ID
// For now the MD and SYW products will use the Explearning email template
export const ProductEmailTemplates: ProductEmailTemplateList = {
  [ProductIdList.EXPN_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPN_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.EXPN_REMOTE_COACH
  },
  [ProductIdList.MDLS_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPN_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.MDLS_REMOTE_COACH
  },
  [ProductIdList.SYW_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPN_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.SYW_REMOTE_COACH
  },
  [ProductIdList.ADVE_REMOTE_COACH]: {
    templateId: EmailTemplateIds.EXPN_REMOTE_COACH_PURCHASE_CONFIRMATION,
    productId: ProductIdList.ADVE_REMOTE_COACH
  },

};

export enum EmailSenderAddresses {
  EXPN_DEFAULT = 'hello@explearning.co',
  EXPN_NEWSLETTER = 'newsletter@explearning.co',
  EXPN_ORDERS = 'orders@explearning.co',
  EXPN_ADMIN = 'admin@explearning.co',
  EXPN_SUPPORT = 'support@explearning.co',
  MDLS_DEFAULT = 'hello@marydaphne.com',
  MDLS_NEWSLETTER = 'newsletter@marydaphne.com',
  MDLS_ORDERS = 'orders@marydaphne.com',
  MDLS_ADMIN = 'admin@marydaphne.com',
  MDLS_SUPPORT = 'support@marydaphne.com',
  SYW_DEFAULT = 'hello@stakeyourwealth.com',
  SYW_NEWSLETTER = 'newsletter@stakeyourwealth.com',
  SYW_ORDERS = 'orders@stakeyourwealth.com',
  SYW_ADMIN = 'admin@stakeyourwealth.com',
  SYW_SUPPORT = 'support@stakeyourwealth.com',
  ADVE_DEFAULT = 'hello@advancedenglish.co',
  ADVE_NEWSLETTER = 'newsletter@advancedenglish.co',
  ADVE_ORDERS = 'orders@advancedenglish.co',
  ADVE_ADMIN = 'admin@advancedenglish.co',
  ADVE_SUPPORT = 'support@advancedenglish.co'
}

export enum EmailSenderNames {
  EXPN_DEFAULT = 'Explearning',
  EXPN_NEWSLETTER = 'Mary Daphne with Explearning',
  EXPN_ADMIN = 'Explearning ADMIN',
  MDLS_DEFAULT = 'Mary Daphne',
  MDLS_NEWSLETTER = 'Mary Daphne',
  MDLS_ADMIN = 'Mary Daphne ADMIN',
  SYW_DEFAULT = 'Stake Your Wealth',
  SYW_NEWSLETTER = 'Stake Your Wealth',
  SYW_ADMIN = 'Stake Your Wealth ADMIN',
  ADVE_DEFAULT = 'Advanced English',
  ADVE_NEWSLETTER = 'Advanced English',
  ADVE_ADMIN = 'Advanced English ADMIN'
}

export const AdminEmailAddresses = {
  EXPN_GREG_ONLY: 'greg@explearning.co',
  EXPN_GREG_AND_MD: ['greg@explearning.co, md@explearning.co'],
  EXPN_DEFAULT: 'hello@explearning.co',
  MDLS_GREG_ONLY: 'greg@marydaphne.com',
  MDLS_GREG_AND_MD: ['greg@marydaphne.com, md@marydaphne.com'],
  MDLS_DEFAULT: 'hello@marydaphne.com',
  SYW_GREG_ONLY: 'greg@stakeyourwealth.com',
  SYW_GREG_AND_MD: ['greg@stakeyourwealth.com, md@stakeyourwealth.com'],
  SYW_DEFAULT: 'hello@stakeyourwealth.com',
  ADVE_GREG_ONLY: 'greg@advancedenglish.co',
  ADVE_GREG_AND_MD: ['greg@advancedenglish.co, md@advancedenglish.co'],
  ADVE_DEFAULT: 'hello@advancedenglish.co',
};
