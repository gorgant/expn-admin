import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/models/products/product.model';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/core/models/routes-and-paths/app-routes.model';
import { Store } from '@ngrx/store';
import { RootStoreState, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { withLatestFrom, map } from 'rxjs/operators';

@Component({
  selector: 'app-product-dashboard',
  templateUrl: './product-dashboard.component.html',
  styleUrls: ['./product-dashboard.component.scss']
})
export class ProductDashboardComponent implements OnInit {

  products$: Observable<Product[]>;

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  ngOnInit() {
    this.initializeProducts();
  }

  onCreateProduct() {
    this.router.navigate([AppRoutes.PRODUCT_NEW]);
  }

  private initializeProducts() {
    this.products$ = this.store$.select(ProductStoreSelectors.selectAllProducts)
    .pipe(
      withLatestFrom(
        this.store$.select(ProductStoreSelectors.selectProductsLoaded)
      ),
      map(([products, productsLoaded]) => {
        // Check if products are loaded, if not fetch from server
        if (!productsLoaded) {
          this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
        }
        return products;
      })
    );
  }

}
