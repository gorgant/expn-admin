import { AuthStoreState } from './auth-store';
import { UserStoreState } from './user-store';
import { PostStoreState } from './post-store';
import { ProductStoreState } from './product-store';
import { OrderStoreState } from './order-store';
import { SubscriberStoreState } from './subscriber-store';
import { ContactFormStoreState } from './contact-form-store';
import { PodcastStoreState } from './podcast-store';
import { CouponStoreState } from './coupon-store';
import { EmailStoreState } from './email-store';
import { AdminFeatureNames } from 'shared-models/ngrx-store/feature-names';

export interface State {
  [AdminFeatureNames.AUTH]: AuthStoreState.State;
  [AdminFeatureNames.USER]: UserStoreState.State;
  [AdminFeatureNames.POSTS]: PostStoreState.State;
  [AdminFeatureNames.PRODUCTS]: ProductStoreState.State;
  [AdminFeatureNames.ORDERS]: OrderStoreState.State;
  [AdminFeatureNames.SUBSCRIBERS]: SubscriberStoreState.State;
  [AdminFeatureNames.CONTACT_FORMS]: ContactFormStoreState.State;
  [AdminFeatureNames.COUPON]: CouponStoreState.State;
  [AdminFeatureNames.EMAIL]: EmailStoreState.State;
  [AdminFeatureNames.PODCASTS]: PodcastStoreState.State;
}
