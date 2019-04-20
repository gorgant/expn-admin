import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, throwError, from, Subject } from 'rxjs';
import { Product } from '../models/products/product.model';
import { AuthService } from './auth.service';
import { takeUntil, map, catchError } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { ProductServiceModule } from '../modules/product-service.module';
import { ImageService } from './image.service';
import { ImageType } from '../models/images/image-type.model';

@Injectable({
  providedIn: ProductServiceModule
})
export class ProductService {

  private imageProcessing$ = new Subject<boolean>();

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private uiService: UiService,
    private imageService: ImageService,
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
          console.log('Error getting products', error);
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
        map(product => {
          console.log('Fetched this product', product);
          return product;
        }),
        catchError(error => {
          this.uiService.showSnackBar(error, null, 5000);
          return throwError(error);
        })
      );
  }

  createProduct(product: Product): Observable<Product> {
    const fbResponse = this.getProductDoc(product.id).set(product)
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
        console.log('Product updated', product);
        return product;
      })
      .catch(error => {
        console.log('Error updating product', error);
        return throwError(error).toPromise();
      });

    return from(fbResponse);
  }

  async deleteProduct(productId: string): Promise<string> {
    await this.imageService.deleteAllItemImages(productId, ImageType.PRODUCT); // Be sure to delete images before deleting the item doc
    const fbResponse = this.getProductDoc(productId).delete()
      .then(empty => {
        console.log('Product deleted', productId);
        return productId;
      })
      .catch(error => {
        return throwError(error).toPromise();
      });

    return fbResponse;
  }

  fetchStorageRef(imagePath: string): AngularFireStorageReference {
    return this.storage.ref(imagePath);
  }

  generateNewId(): string {
    return this.afs.createId();
  }

  getImageProcessing(): Subject<boolean> {
    return this.imageProcessing$;
  }

  private getProductsCollection(): AngularFirestoreCollection<Product> {
    return this.afs.collection<Product>('products');
  }

  getProductDoc(productId: string): AngularFirestoreDocument<Product> {
    return this.getProductsCollection().doc<Product>(productId);
  }
}
