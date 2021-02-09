import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { EmailSubscriber } from 'shared-models/subscribers/email-subscriber.model';
import { SubCountData } from 'shared-models/subscribers/sub-count-data.model';

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
  isLoading: boolean;
  isExportingSubscribers: boolean;
  isProcessingSubscriberCount: boolean;
  loadError: any;
  exportSubscribersError: any;
  subscriberCountError: any;
  subscribersLoaded: boolean;
  downloadUrl: string;
  subCountData: SubCountData;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    isExportingSubscribers: false,
    isProcessingSubscriberCount: false,
    loadError: null,
    exportSubscribersError: null,
    subscriberCountError: null,
    subscribersLoaded: false,
    downloadUrl: null,
    subCountData: null,
  }
);
