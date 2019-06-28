import { Pipe, PipeTransform } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreSelectors } from 'src/app/root-store';
import { map } from 'rxjs/operators';
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

    // Product data should be initialized on the page where the product is displayed
    return this.store$.select(ProductStoreSelectors.selectProductById(productId))
      .pipe(
        map(product => {
          const name = product.name;
          return name;
        })
      );
  }

}
