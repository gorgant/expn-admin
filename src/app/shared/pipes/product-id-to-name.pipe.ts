import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Pipe({
  name: 'productIdToName'
})
export class ProductIdToNamePipe implements PipeTransform {

  constructor(
    private store$: Store<RootStoreState.State>
  ) {}

  transform(productId: string): Observable<string> {

    if (!productId) {
      return of('');
    }

    // Product data is initialized on the orders page
    return this.store$.select(ProductStoreSelectors.selectProductById(productId))
      .pipe(
        map(product => {
          const name = product.name;
          return name;
        })
      );
  }

}
