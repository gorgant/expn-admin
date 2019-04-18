import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, throwError, from } from 'rxjs';
import { Product } from '../models/products/product.model';
import { AuthService } from './auth.service';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private uiService: UiService
  ) { }

  fetchAllProducts(): Observable<Product[]> {
    const productCollection = this.getProductsCollection();
    return productCollection.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(products => {
          console.log('Fetched all products', products);
          return products;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  fetchSingleProduct(productId: string): Observable<Product> {
    const productDoc = this.getProductDoc(productId);
    return productDoc.valueChanges()
      .pipe(
        takeUntil(this.authService.unsubTrigger$),
        map(product => product),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  createProduct(product: Product): Observable<Product> {
    const productId = this.generateNewId();
    const fbResponse = this.getProductDoc(productId).set(product)
      .then(empty => {
        console.log('Product created', product);
        return product;
      })
      .catch(error => {
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  updateProduct(product: Product): Observable<Product> {
    const fbResponse = this.getProductDoc(product.id).update(product)
      .then(empty => {
        return product;
      })
      .catch(error => {
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  deleteProduct(product: Product): Observable<Product> {
    const fbResponse = this.getProductDoc(product.id).delete()
      .then(empty => {
        return product;
      })
      .catch(error => {
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  generateNewId(): string {
    return this.afs.createId();
  }

  private getProductsCollection(): AngularFirestoreCollection<Product> {
    return this.afs.collection<Product>('products');
  }

  private getProductDoc(productId: string): AngularFirestoreDocument<Product> {
    return this.getProductsCollection().doc<Product>(productId);
  }
}
