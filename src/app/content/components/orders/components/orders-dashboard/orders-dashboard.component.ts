import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from 'src/app/core/models/orders/order.model';
import { Store } from '@ngrx/store';
import { RootStoreState, OrderStoreSelectors, OrderStoreActions, ProductStoreSelectors, ProductStoreActions } from 'src/app/root-store';
import { withLatestFrom, map, take } from 'rxjs/operators';
import { MatTableDataSource, MatSort, MatPaginator } from '@angular/material';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './orders-dashboard.component.html',
  styleUrls: ['./orders-dashboard.component.scss']
})
export class OrdersDashboardComponent implements OnInit {

  orders$: Observable<Order[]>;
  displayedColumns = ['processedDate', 'orderNumber', 'productId', 'amountPaid', 'status', 'email'];
  dataSource = new MatTableDataSource<Order>();
  isLoading$: Observable<boolean>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private store$: Store<RootStoreState.State>,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit() {
    this.initializeOrders();
    this.initializeProducts(); // Ensures this is available for productIdToName pipe
    this.initializeMatTable();
    this.initBreakpointObserver();
  }

  private initializeOrders() {
    this.isLoading$ = this.store$.select(OrderStoreSelectors.selectOrderIsLoading);

    this.orders$ = this.store$.select(OrderStoreSelectors.selectAllOrders)
      .pipe(
        withLatestFrom(
          this.store$.select(OrderStoreSelectors.selectOrdersLoaded)
        ),
        map(([orders, ordersLoaded]) => {
          // Check if posts are loaded, if not fetch from server
          if (!ordersLoaded) {
            this.store$.dispatch(new OrderStoreActions.AllOrdersRequested());
          }
          return orders;
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
          // Check if posts are loaded, if not fetch from server
          if (!productsLoaded) {
            this.store$.dispatch(new ProductStoreActions.AllProductsRequested());
          }
          console.log('Returning product list');
          return products;
        })
      ).subscribe();
  }

  private initializeMatTable() {
    this.orders$.subscribe(orders => this.dataSource.data = orders); // Supply data
    this.dataSource.sort = this.sort; // Configure sorting on headers
    this.dataSource.paginator = this.paginator; // Configure pagination
  }

  private initBreakpointObserver() {
    this.breakpointObserver.observe(['(max-width: 959px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.displayedColumns = ['processedDate', 'orderNumber', 'amountPaid'];
        } else {
          this.displayedColumns = ['processedDate', 'orderNumber', 'productId', 'amountPaid', 'status', 'email'];
        }
      });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
