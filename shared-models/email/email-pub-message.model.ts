import { EmailIdentifiers } from './email-vars.model';
import { ContactForm } from '../user/contact-form.model';
import { EmailUserData } from './email-user-data.model';
import { OptInCountComparisonData } from './opt-in-count-comparison-data';

export interface EmailPubMessage {
  contactForm?: ContactForm;
  emailIdentifier: EmailIdentifiers;
  emailUserData: EmailUserData;
  optInCountComparisonData?: OptInCountComparisonData
}