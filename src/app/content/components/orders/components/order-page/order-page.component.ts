import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { RootStoreState, OrderStoreSelectors, OrderStoreActions, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { ActivatedRoute } from '@angular/router';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { Order } from 'shared-models/orders/order.model';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss']
})
export class OrderPageComponent implements OnInit {

  order$: Observable<Order>;
  private orderLoaded: boolean;

  // productsLoaded$: Observable<boolean>;

  constructor(
    private store$: Store<RootStoreState.State>,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.initializeProducts();
    this.loadExistingOrderData();
  }

  private loadExistingOrderData() {
    // Check if id params are available
    const idParamName = 'id';
    const idParam = this.route.snapshot.params[idParamName];
    if (idParam) {
      console.log('Order detected with id', idParam);
      this.order$ = this.getOrder(idParam);
    }
  }

  private getOrder(orderId: string): Observable<Order> {
    console.log('Getting order', orderId);
    return this.store$.select(OrderStoreSelectors.selectOrderById(orderId))
    .pipe(
      withLatestFrom(
        this.store$.select(OrderStoreSelectors.selectOrdersLoaded)
      ),
      map(([order, ordersLoaded]) => {
        // Check if items are loaded, if not fetch from server
        if (!ordersLoaded && !this.orderLoaded) {
          console.log('No order in store, fetching from server', orderId);
          this.store$.dispatch(new OrderStoreActions.SingleOrderRequested({orderId}));
        }
        console.log('Single order status', this.orderLoaded);
        this.orderLoaded = true; // Prevents loading from firing more than needed
        return order;
      })
    );
  }

  private initializeProducts() {
    this.store$.select(ProductStoreSelectors.selectAllProducts)
      .pipe(
        take(1),
        withLatestFrom(
          this.store$.select(ProductStoreSelectors.selectProductsLoaded)
        ),
        map(([products, productsLoaded]) => {
          // Check if items are loaded, if not fetch from server
          if (!productsLoaded) {
            this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
          }
          console.log('Returning product list');
          return products;
        })
      ).subscribe();
  }

}
