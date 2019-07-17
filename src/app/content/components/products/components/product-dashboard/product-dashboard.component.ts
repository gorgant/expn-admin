import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';
import { Product } from 'shared-models/products/product.model';
import { AdminAppRoutes } from 'shared-models/routes-and-paths/app-routes.model';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  products$: Observable<Product[]>;
  deletionProcessing$: Observable<boolean>;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.initializeProducts();
  }

  onCreateProduct() {
    this.router.navigate([AdminAppRoutes.PRODUCT_NEW]);
  }

  private initializeProducts() {
    this.deletionProcessing$ = this.store$.select(ProductStoreSelectors.selectDeletionProcessing);
    this.products$ = this.store$.select(ProductStoreSelectors.selectAllProducts)
    .pipe(
      withLatestFrom(
        this.store$.select(ProductStoreSelectors.selectProductsLoaded),
        this.store$.select(ProductStoreSelectors.selectDeletionProcessing), // Prevents error loading deleted data
      ),
      map(([products, productsLoaded, deletionProcessing]) => {
        // Check if products are loaded, if not fetch from server
        if (!productsLoaded && !deletionProcessing) {
          this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
        }
        return products;
      })
    );
  }

}
