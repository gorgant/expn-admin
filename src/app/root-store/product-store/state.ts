import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from 'src/app/core/models/products/product.model';

export const featureAdapter: EntityAdapter<Product>
  = createEntityAdapter<Product>(
    {
      selectId: (product: Product) => product.id,

      // Sort by list order
      sortComparer: (a: Product, b: Product): number => {
        const listOrderA = a.listOrder;
        const listOrderB = b.listOrder;
        return listOrderA.toString().localeCompare(listOrderB.toString(), undefined, {numeric: true});
      }
    }
  );

export interface State extends EntityState<Product> {
  isLoading?: boolean;
  error?: any;
  productsLoaded?: boolean;
  deletionProcessing: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    error: null,
    productsLoaded: false,
    deletionProcessing: false,
  }
);
