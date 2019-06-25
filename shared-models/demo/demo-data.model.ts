import { EmailSubscriber } from '../subscribers/email-subscriber.model';
import { PublicUser } from '../user/public-user.model';
import { now } from 'moment';
import { SubscriptionSource } from '../subscribers/subscription-source.model';
import { ContactForm } from '../user/contact-form.model';

export const demoPublicUser: PublicUser = {
  id: '123456abcdef',
  lastAuthenticated: now(),
  modifiedDate: now(),
  createdDate: now(),
  billingDetails: {
    firstName: 'Bob',
    lastName: 'Tracy',
    email: 'bob@tim.com',
    phone: '917 513 2400',
    billingOne: '30 N Gould St.',
    billingTwo: 'Ste 7313',
    city: 'Sheridan',
    state: 'Wyoming',
    usStateCode: 'WY',
    postalCode: '82801',
    country: 'United States',
    countryCode: 'US'
  }
};

export const demoSubscriber: EmailSubscriber = {
  id: 'bob@tim.com',
  publicUserData: demoPublicUser,
  active: true,
  createdDate: now(),
  modifiedDate: now(),
  lastSubSource: SubscriptionSource.CONTACT_FORM,
  subscriptionSources: [
    SubscriptionSource.CONTACT_FORM,
    SubscriptionSource.CHECKOUT
  ]
};

export const demoContactForms: ContactForm[] = [
  {
    id: 'zxcvlkjwoi234iasdlfkj',
    createdDate: now(),
    name: 'Bobby Brown',
    email: 'bob@tim.com',
    message: 'Cool stuff today yo fo sho',
    publicUser: demoPublicUser
  },
  {
    id: 'qwpreoqwaf1243kfds',
    createdDate: now() - (1000 * 60 * 60 * 24 * 2),
    name: 'Zorba Joabo',
    email: 'zorba@jim.com',
    message: 'Lovin life on the crazy side yessir',
    publicUser: demoPublicUser
  },
  {
    id: 'poiuqwerkjds823kds',
    createdDate: now() - (1000 * 60 * 60 * 24 * 4),
    name: 'Bobby Brown',
    email: 'bob@tim.com',
    message: 'Nothin like a hot shower on a cold day, mmmhmmm',
    publicUser: demoPublicUser
  }
];
