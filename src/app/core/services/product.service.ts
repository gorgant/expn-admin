import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, throwError, from, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { takeUntil, map, catchError, switchMap, take } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { ImageService } from './image.service';
import { PublicService } from './public.service';
import { Product } from 'shared-models/products/product.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';
import { AltEnvService } from './alt-env.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private imageProcessing$ = new Subject<boolean>();

  constructor(
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    private authService: AuthService,
    private uiService: UiService,
    private imageService: ImageService,
    private publicService: PublicService,
    private altEnvService: AltEnvService,
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
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching all products', error);
          return throwError(error);
        })
      );
  }

  fetchSingleProduct(productId: string): Observable<Product> {
    const productDoc = this.getProductDoc(productId);
    return productDoc.valueChanges()
      .pipe(
        // takeUntil(this.authService.unsubTrigger$),
        take(1), // Prevents load attempts after deletion
        map(product => {
          console.log('Fetched this product', product);
          return product;
        }),
        catchError(error => {
          this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
          console.log('Error fetching single product', error);
          return throwError(error);
        })
      );
  }

  updateProduct(product: Product): Observable<Product> {
    const fbResponse = from(this.getProductDoc(product.id).set(product, {merge: true}));
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Product updated', product);
        return product;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating product', error);
        return throwError(error);
      })
    );
  }

  rollbackProduct(product: Product): Observable<Product> {
    const fbResponse = from(this.getProductDoc(product.id).set(product)); // No merge, avoid lingering new fields from discarded changes
    return fbResponse.pipe(
      take(1),
      map(empty => {
        console.log('Product rolled back', product);
        return product;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating product', error);
        return throwError(error);
      })
    );
  }

  deleteProduct(productId: string): Observable<string> {

    const deleteImageRes = from(this.imageService.deleteAllItemImages(
      productId, ImageType.PRODUCT_CARD // Any product image type will work here
    ));

    // First delete doc images from storage, then delete doc itself
    return deleteImageRes.pipe(
      switchMap(empty => {
        return from(this.getProductDoc(productId).delete()).pipe(
          map(empt => productId)
        );
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error deleting product', error);
        return throwError(error);
      })
    );

  }

  // Update product on server (local update happens in store effects)
  toggleProductActive(product: Product): Observable<Product> {
    let updatedProduct: Product = {
      ...product
    };
    if (!product.active) {
      updatedProduct = {
        ...updatedProduct,
        active: true,
      };
    } else {
      updatedProduct = {
        ...updatedProduct,
        active: false,
      };
    }

    return this.submitPubProductUpdate(updatedProduct);
  }

  private submitPubProductUpdate(updatedProduct: Product): Observable<Product> {
    const serverRes = this.publicService.updatePublicProduct(updatedProduct);

    return serverRes.pipe(
      map(res => {
        console.log('Server call succeded', res);
        return updatedProduct;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error updating product on public server', error);
        return throwError(error.message ? error.message : error);
      })
    );
  }

  cloneProductonAltAdmin(product: Product): Observable<Product> {
    const serverRes = this.altEnvService.cloneProductOnAltAdmin(product);

    return serverRes.pipe(
      map(res => {
        console.log('Server call succeded', res);
        return product;
      }),
      catchError(error => {
        this.uiService.showSnackBar('Error performing action. Changes not saved.', 10000);
        console.log('Error cloning product on alt admin', error);
        return throwError(error.message ? error.message : error);
      })
    );
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

  getProductDoc(productId: string): AngularFirestoreDocument<Product> {
    return this.getProductsCollection().doc<Product>(productId);
  }

  private getProductsCollection(): AngularFirestoreCollection<Product> {
    return this.afs.collection<Product>(SharedCollectionPaths.PRODUCTS);
  }
}
