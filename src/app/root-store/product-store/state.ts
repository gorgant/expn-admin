import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { Product } from 'shared-models/products/product.model';

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
  isLoading: boolean;
  isSaving: boolean;
  isDeleting: boolean;
  isTogglingActive: boolean;
  loadError: any;
  saveError: any;
  deleteError: any;
  publicUpdateError: any;
  productsLoaded: boolean;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    isLoading: false,
    isSaving: false,
    isDeleting: false,
    isTogglingActive: false,
    loadError: null,
    saveError: null,
    deleteError: null,
    publicUpdateError: null,
    productsLoaded: false,
  }
);
