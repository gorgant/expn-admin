import { EmailCategories } from './email-vars.model';
import { EmailSubscriber } from '../subscribers/email-subscriber.model';
import { ContactForm } from '../user/contact-form.model';
import { Order } from '../orders/order.model';
import { WebpageLoadFailureData } from '../ssr/webpage-load-failure-data.model';

export interface EmailPubMessage {
  emailCategory: EmailCategories;
  subscriber?: EmailSubscriber;
  contactForm?: ContactForm;
  order?: Order;
  webpageLoadFailureData?: WebpageLoadFailureData;
}
