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

export interface State {
  auth: AuthStoreState.State;
  user: UserStoreState.State;
  posts: PostStoreState.State;
  products: ProductStoreState.State;
  orders: OrderStoreState.State;
  subscribers: SubscriberStoreState.State;
  contactForms: ContactFormStoreState.State;
  coupon: CouponStoreState.State;
  email: EmailStoreState.State;
  podcasts: PodcastStoreState.State;
}
