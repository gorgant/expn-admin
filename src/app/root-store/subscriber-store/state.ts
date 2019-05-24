import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { EmailSubscriber } from 'src/app/core/models/subscribers/email-subscriber.model';

export const featureAdapter: EntityAdapter<EmailSubscriber>
  = createEntityAdapter<EmailSubscriber>(
    {
      selectId: (subscriber: EmailSubscriber) => subscriber.id,

      // Sort by date
      sortComparer: (a: EmailSubscriber, b: EmailSubscriber): number => {
        const subscriberIdA = a.id;
        const subscriberIdB = b.id;
        return subscriberIdA.toString().localeCompare(subscriberIdB.toString(), undefined, {numeric: false});
      }
    }
  );

export interface State extends EntityState<EmailSubscriber> {
  isLoading?: boolean;
  error?: any;
  subscribersLoaded?: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    subscribersLoaded: false,
  }
);
