import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { UiService } from './ui.service';
import { Observable, throwError } from 'rxjs';
import { Order } from '../models/orders/order.model';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { FbCollectionPaths } from '../models/routes-and-paths/fb-collection-paths';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private authService: AuthService,
    private uiService: UiService,
    private afs: AngularFirestore
  ) { }

  fetchAllOrders(): Observable<Order[]> {
    const orderCollection = this.getOrdersCollection();
    return orderCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(orders => {
          console.log('Fetched all orders', orders);
          return orders;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchSingleOrder(orderId: string): Observable<Order> {
    const orderDoc = this.getOrderDoc(orderId);
    return orderDoc.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(order => order),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  private getOrdersCollection(): AngularFirestoreCollection<Order> {
    return this.afs.collection<Order>(FbCollectionPaths.ORDERS, ref => ref.orderBy('processedDate', 'desc'));
  }

  private getOrderDoc(orderId: string): AngularFirestoreDocument<Order> {
    return this.getOrdersCollection().doc<Order>(orderId);
  }
}
