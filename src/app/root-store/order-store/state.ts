import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Order } from 'src/app/core/models/orders/order.model';

export const featureAdapter: EntityAdapter<Order>
  = createEntityAdapter<Order>(
    {
      selectId: (order: Order) => order.id,

      // Sort by date
      sortComparer: (a: Order, b: Order): number => {
        const createdDateA = a.createdDate;
        const createdDateB = b.createdDate;
        return createdDateB.toString().localeCompare(createdDateA.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<Order> {
  isLoading?: boolean;
  error?: any;
  ordersLoaded?: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    ordersLoaded: false,
  }
);
