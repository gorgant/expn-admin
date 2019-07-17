import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, throwError, from, Subject, of } from 'rxjs';
import { AuthService } from './auth.service';
import { takeUntil, map, catchError, switchMap, take } from 'rxjs/operators';
import { UiService } from './ui.service';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { ImageService } from './image.service';
import { PublicService } from './public.service';
import { Product } from 'shared-models/products/product.model';
import { ImageType } from 'shared-models/images/image-type.model';
import { SharedCollectionPaths } from 'shared-models/routes-and-paths/fb-collection-paths';

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
        // takeUntil(this.authService.unsubTrigger$),
        take(1), // Prevents load attempts after deletion
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
        console.log('Error creating product', error);
        return error;
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
        return error;
      });

    return from(fbResponse);
  }

  deleteProduct(productId: string): Observable<string> {
    // Be sure to delete images before deleting the item doc
    const deleteImagePromise = this.imageService.deleteAllItemImages(
      productId, ImageType.PRODUCT_CARD // Any product image type will work here
    ).catch(err => {
      console.log('Error deleting product images', err);
      return err;
    });

    return from(deleteImagePromise)
      .pipe(
        switchMap(res => {
          const fbResponse = this.getProductDoc(productId).delete()
          .then(empty => {
            console.log('Product deleted', productId);
            return productId;
          })
          .catch(error => {
            console.log('Error deleting product', error);
            return throwError(error).toPromise();
          });
          return from(fbResponse);
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

    const serverRes = this.publicService.updatePublicProduct(updatedProduct)
      .then(res => {
        console.log('Server call succeded', res);
        return updatedProduct;
      })
      .catch(error => {
        console.log('Error updating product', error);
        return error;
      });

    // For instant UI updates, don't wait for server response
    return of(updatedProduct);
  }

  // activateProduct(product: Product): void {
  //   const activatedProduct: Product = {
  //     ...product,
  //     active: true,
  //   };

  //   this.getProductDoc(product.id).update(activatedProduct)
  //     .then(res => {
  //       // If the local update is successful, update on other server
  //       this.publicService.updatePublicProduct(activatedProduct); // Will activate product on public server
  //     })
  //     .catch(error => {
  //       console.log('Error activating product in admin', error);
  //     });
  // }

  // deactivateProduct(product: Product): void {

  //   const deactivatedProduct: Product = {
  //     ...product,
  //     active: false,
  //   };

  //   this.getProductDoc(product.id).update(deactivatedProduct)
  //     .then(res => {
  //       // If the local update is successful, update on other server
  //       this.publicService.updatePublicProduct(deactivatedProduct); // Will deactivate product on public server
  //     })
  //     .catch(error => {
  //       console.log('Error updating product', error);
  //     });
  // }

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
